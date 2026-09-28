import pdb
from pathlib import Path
import sys
import os

import onnxruntime as ort
import torch

PROJECT_ROOT = Path(__file__).absolute().parents[0].absolute()
sys.path.insert(0, str(PROJECT_ROOT))

from parsing_api import onnx_inference


class Parsing:
    def __init__(self, gpu_id: int = 0):
        self.gpu_id = gpu_id

        # CPU mode: CUDA is not available on this system.
        session_options = ort.SessionOptions()
        session_options.graph_optimization_level = (
            ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        )
        session_options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL

        # Use CPUExecutionProvider because this machine has no NVIDIA GPU.
        self.session = ort.InferenceSession(
            os.path.join(
                Path(__file__).absolute().parents[2].absolute(),
                "ckpt/humanparsing/parsing_atr.onnx"
            ),
            sess_options=session_options,
            providers=["CPUExecutionProvider"]
        )

        self.lip_session = ort.InferenceSession(
            os.path.join(
                Path(__file__).absolute().parents[2].absolute(),
                "ckpt/humanparsing/parsing_lip.onnx"
            ),
            sess_options=session_options,
            providers=["CPUExecutionProvider"]
        )

    def __call__(self, input_image):
        parsed_image, face_mask = onnx_inference(
            self.session,
            self.lip_session,
            input_image
        )

        return parsed_image, face_mask