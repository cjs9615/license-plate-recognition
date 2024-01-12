from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

#TrOCR
def result_TrOCR(processor, model, img, device):
    pixel_values = processor(images=img, return_tensors="pt").pixel_values.to(device)

    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return generated_text