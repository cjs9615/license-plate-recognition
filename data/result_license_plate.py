import numpy as np
from result_RealESRGAN import result_RealESRGAN
from result_TrOCR import result_TrOCR
from result_truck_detection import result_truck_detection

# 번호판 탐지 모델 결과
def result_license_plate(model_license_plate, model_RealESRGAN, processor_trocr, model_trocr, processor_detr, model_detr, img, threshold, device):
    # perform inference
    results = model_license_plate(img, size=640)

    # inference with test time augmentation
    results = model_license_plate(img, augment=True)

    # parse results
    predictions = results.pred[0]
    boxes = predictions[:, :4] # x1, y1, x2, y2
    scores = predictions[:, 4]
    #categories = predictions[:, 5]

    license_plate_img = 'no license_plate'
    x1, y1, x2, y2 = 0, 0, 0, 0
    #print('번호판 정확도',scores[0])
    # show detection bounding boxes on image
    if (len(boxes) > 0) and scores[0]>=threshold:
        for box in boxes :
            # Get the coordinates of the first bounding box
            x1, y1, x2, y2 = map(int, box)

            # Crop the license plate region from the original image
            license_plate_img = img.crop((x1, y1, x2, y2))
            image_array = np.array(license_plate_img)
            if(len(image_array) < 15) :
                license_plate_img_size = license_plate_img.size
                license_plate_img  = license_plate_img.resize((int(license_plate_img_size[0]*(1.1)), int(license_plate_img_size[1]*(1.1))))
                image_array = np.array(license_plate_img)
            if(len(image_array) < 15) :
                license_plate_img = 'image too small'
                break

            #이미지 화질 개선
            sr_img = result_RealESRGAN(model_RealESRGAN, license_plate_img)

            #TrOCR
            generated_text = result_TrOCR(processor_trocr, model_trocr, sr_img, device)

            if 'DO' in generated_text or 'NO' in generated_text or 'SO' in generated_text or 'RO' in generated_text  :
                license_plate_img = 'no license_plate'
            else :
                # Save or display the cropped license plate image
                license_plate_img.save("./images/"+'license_plate_img'+'.jpg','JPEG')
                result_truck_detection(processor_detr, model_detr, img, x1, y1, x2, y2, 0.007)
                return generated_text
        
    return license_plate_img
        