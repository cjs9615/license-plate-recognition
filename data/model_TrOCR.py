from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

#TrOCR
def model_TrOCR():
    img = Image.open('./images/sr_img.jpg')
    processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-printed')
    model1 = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-large-printed')
    pixel_values = processor(images=img, return_tensors="pt").pixel_values

    generated_ids = model1.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return generated_text