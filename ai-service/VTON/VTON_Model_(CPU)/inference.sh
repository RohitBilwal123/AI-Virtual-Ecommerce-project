accelerate launch inference.py --pretrained_model_name_or_path "./Model" \
    --width 768 --height 1024 --num_inference_steps 30 \
    --output_dir "result" --data_dir "./Dataset/zalando" \
    --seed 42 --test_batch_size 2 --guidance_scale 2.0


accelerate launch inference.py --pretrained_model_name_or_path "./Model" \
    --width 768 --height 1024 --num_inference_steps 30 \
    --output_dir "result" --unpaired --data_dir "./Dataset/zalando" \
    --seed 42 --test_batch_size 2 --guidance_scale 2.0



accelerate launch inference_dc.py --pretrained_model_name_or_path "./Model" \
    --width 768 --height 1024 --num_inference_steps 30 \
    --output_dir "result" --unpaired --data_dir "./Dataset/DressCode" \
    --seed 42 --test_batch_size 2 --guidance_scale 2.0 --category "upper_body"

accelerate launch inference_dc.py --pretrained_model_name_or_path "./Model" \
    --width 768 --height 1024 --num_inference_steps 30 \
    --output_dir "result" --unpaired --data_dir "./Dataset/DressCode" \
    --seed 42 --test_batch_size 2 --guidance_scale 2.0 --category "lower_body"

accelerate launch inference_dc.py --pretrained_model_name_or_path "./Model" \
    --width 768 --height 1024 --num_inference_steps 30 \
    --output_dir "result" --unpaired --data_dir "./Dataset/DressCode" \
    --seed 42 --test_batch_size 2 --guidance_scale 2.0 --category "dresses"