
from dataclasses import dataclass
from enum import Enum

from detectron2.config import CfgNode


class DensePoseUVConfidenceType(Enum):
    """
    Statistical model type for confidence learning, possible values:
     - "iid_iso": statistically independent identically distributed residuals
         with anisotropic covariance
     - "indep_aniso": statistically independent residuals with anisotropic
         covariances
    For details, see:
    N. Neverova, D. Novotny, A. Vedaldi "Correlated Uncertainty for Learning
    Dense Correspondences from Noisy Labels", p. 918--926, in Proc. NIPS 2019
    """

    IID_ISO     = "iid_iso"
    INDEP_ANISO = "indep_aniso"


@dataclass
class DensePoseUVConfidenceConfig:
    """
    Configuration options for confidence on UV data
    """

    enabled: bool = False
    epsilon: float = 0.01
    type: DensePoseUVConfidenceType = DensePoseUVConfidenceType.IID_ISO


@dataclass
class DensePoseSegmConfidenceConfig:
    """
    Configuration options for confidence on segmentation
    """

    enabled: bool = False
    epsilon: float = 0.01


@dataclass
class DensePoseConfidenceModelConfig:
    """
    Configuration options for confidence models
    """

    uv_confidence: DensePoseUVConfidenceConfig
    segm_confidence: DensePoseSegmConfidenceConfig

    @staticmethod
    def from_cfg(cfg: CfgNode) -> "DensePoseConfidenceModelConfig":
        return DensePoseConfidenceModelConfig(
            uv_confidence=DensePoseUVConfidenceConfig(
                enabled=cfg.MODEL.ROI_DENSEPOSE_HEAD.UV_CONFIDENCE.ENABLED,
                epsilon=cfg.MODEL.ROI_DENSEPOSE_HEAD.UV_CONFIDENCE.EPSILON,
                type=DensePoseUVConfidenceType(cfg.MODEL.ROI_DENSEPOSE_HEAD.UV_CONFIDENCE.TYPE),
            ),
            segm_confidence=DensePoseSegmConfidenceConfig(
                enabled=cfg.MODEL.ROI_DENSEPOSE_HEAD.SEGM_CONFIDENCE.ENABLED,
                epsilon=cfg.MODEL.ROI_DENSEPOSE_HEAD.SEGM_CONFIDENCE.EPSILON,
            ),
        )
