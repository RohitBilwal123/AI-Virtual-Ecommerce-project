import json
import logging
import os

from detectron2.data import DatasetCatalog, MetadataCatalog
from detectron2.data.datasets.builtin_meta import CITYSCAPES_CATEGORIES
from detectron2.utils.file_io import PathManager

"""
This file contains functions to register the Cityscapes panoptic dataset to the DatasetCatalog.
"""


logger = logging.getLogger(__name__)


def get_cityscapes_panoptic_files(image_dir, gt_dir, json_info):
    files = []
    cities = PathManager.ls(image_dir)
    logger.info(f"{len(cities)} cities found in '{image_dir}'.")
    image_dict = {}
    for city in cities:
        city_img_dir = os.path.join(image_dir, city)
        for basename in PathManager.ls(city_img_dir):
            image_file = os.path.join(city_img_dir, basename)

            suffix = "_leftImg8bit.png"
            assert basename.endswith(suffix), basename
            basename = os.path.basename(basename)[: -len(suffix)]

            image_dict[basename] = image_file

    for ann in json_info["annotations"]:
        image_file = image_dict.get(ann["image_id"], None)
        assert image_file is not None, "No image {} found for annotation {}".format(
            ann["image_id"], ann["file_name"]
        )
        label_file = os.path.join(gt_dir, ann["file_name"])
        segments_info = ann["segments_info"]

        files.append((image_file, label_file, segments_info))

    assert len(files), "No images found in {}".format(image_dir)
    assert PathManager.isfile(files[0][0]), files[0][0]
    assert PathManager.isfile(files[0][1]), files[0][1]
    return files


def load_cityscapes_panoptic(image_dir, gt_dir, gt_json, meta):
    """
    Args:
        image_dir (str): path to the raw dataset. e.g., "~/cityscapes/leftImg8bit/train".
        gt_dir (str): path to the raw annotations. e.g.,
            "~/cityscapes/gtFine/cityscapes_panoptic_train".
        gt_json (str): path to the json file. e.g.,
            "~/cityscapes/gtFine/cityscapes_panoptic_train.json".
        meta (dict): dictionary containing "thing_dataset_id_to_contiguous_id"
            and "stuff_dataset_id_to_contiguous_id" to map category ids to
            contiguous ids for training.

    Returns:
        list[dict]: a list of dicts in Detectron2 standard format. (See
        `Using Custom Datasets </tutorials/datasets.html>`_ )
    """

    def _convert_category_id(segment_info, meta):
        if segment_info["category_id"] in meta["thing_dataset_id_to_contiguous_id"]:
            segment_info["category_id"] = meta["thing_dataset_id_to_contiguous_id"][
                segment_info["category_id"]
            ]
        else:
            segment_info["category_id"] = meta["stuff_dataset_id_to_contiguous_id"][
                segment_info["category_id"]
            ]
        return segment_info

    assert os.path.exists(
        gt_json
    ), "Please run `python cityscapesscripts/preparation/createPanopticImgs.py` to generate label files."  # noqa
    with open(gt_json) as f:
        json_info = json.load(f)
    files = get_cityscapes_panoptic_files(image_dir, gt_dir, json_info)
    ret = []
    for image_file, label_file, segments_info in files:
        sem_label_file = (
            image_file.replace("leftImg8bit", "gtFine").split(".")[0] + "_labelTrainIds.png"
        )
        segments_info = [_convert_category_id(x, meta) for x in segments_info]
        ret.append(
            {
                "file_name": image_file,
                "image_id": "_".join(
                    os.path.splitext(os.path.basename(image_file))[0].split("_")[:3]
                ),
                "sem_seg_file_name": sem_label_file,
                "pan_seg_file_name": label_file,
                "segments_info": segments_info,
            }
        )
    assert len(ret), f"No images found in {image_dir}!"
    assert PathManager.isfile(
        ret[0]["sem_seg_file_name"]
    ), "Please generate labelTrainIds.png with cityscapesscripts/preparation/createTrainIdLabelImgs.py"  # noqa
    assert PathManager.isfile(
        ret[0]["pan_seg_file_name"]
    ), "Please generate panoptic annotation with python cityscapesscripts/preparation/createPanopticImgs.py"  # noqa
    return ret


_RAW_CITYSCAPES_PANOPTIC_SPLITS = {
    "cityscapes_fine_panoptic_train": (
        "cityscapes/leftImg8bit/train",
        "cityscapes/gtFine/cityscapes_panoptic_train",
        "cityscapes/gtFine/cityscapes_panoptic_train.json",
    ),
    "cityscapes_fine_panoptic_val": (
        "cityscapes/leftImg8bit/val",
        "cityscapes/gtFine/cityscapes_panoptic_val",
        "cityscapes/gtFine/cityscapes_panoptic_val.json",
    ),
}


def register_all_cityscapes_panoptic(root):
    meta = {}
    thing_classes = [k["name"] for k in CITYSCAPES_CATEGORIES]
    thing_colors = [k["color"] for k in CITYSCAPES_CATEGORIES]
    stuff_classes = [k["name"] for k in CITYSCAPES_CATEGORIES]
    stuff_colors = [k["color"] for k in CITYSCAPES_CATEGORIES]

    meta["thing_classes"] = thing_classes
    meta["thing_colors"] = thing_colors
    meta["stuff_classes"] = stuff_classes
    meta["stuff_colors"] = stuff_colors

    thing_dataset_id_to_contiguous_id = {}
    stuff_dataset_id_to_contiguous_id = {}

    for k in CITYSCAPES_CATEGORIES:
        if k["isthing"] == 1:
            thing_dataset_id_to_contiguous_id[k["id"]] = k["trainId"]
        else:
            stuff_dataset_id_to_contiguous_id[k["id"]] = k["trainId"]

    meta["thing_dataset_id_to_contiguous_id"] = thing_dataset_id_to_contiguous_id
    meta["stuff_dataset_id_to_contiguous_id"] = stuff_dataset_id_to_contiguous_id

    for key, (image_dir, gt_dir, gt_json) in _RAW_CITYSCAPES_PANOPTIC_SPLITS.items():
        image_dir = os.path.join(root, image_dir)
        gt_dir = os.path.join(root, gt_dir)
        gt_json = os.path.join(root, gt_json)

        DatasetCatalog.register(
            key, lambda x=image_dir, y=gt_dir, z=gt_json: load_cityscapes_panoptic(x, y, z, meta)
        )
        MetadataCatalog.get(key).set(
            panoptic_root=gt_dir,
            image_root=image_dir,
            panoptic_json=gt_json,
            gt_dir=gt_dir.replace("cityscapes_panoptic_", ""),
            evaluator_type="cityscapes_panoptic_seg",
            ignore_label=255,
            label_divisor=1000,
            **meta,
        )
