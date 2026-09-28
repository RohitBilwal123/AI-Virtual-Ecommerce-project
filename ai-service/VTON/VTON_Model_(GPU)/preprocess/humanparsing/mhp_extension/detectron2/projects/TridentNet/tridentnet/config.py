
from detectron2.config import CfgNode as CN


def add_tridentnet_config(cfg):
    """
    Add config for tridentnet.
    """
    _C = cfg

    _C.MODEL.TRIDENT = CN()

    _C.MODEL.TRIDENT.NUM_BRANCH = 3
    _C.MODEL.TRIDENT.BRANCH_DILATIONS = [1, 2, 3]
    _C.MODEL.TRIDENT.TRIDENT_STAGE = "res4"
    _C.MODEL.TRIDENT.TEST_BRANCH_IDX = 1
