from flask import Flask, request, jsonify
from PIL import Image
import requests
import base64
import torch

import os
import yolov5
import numpy as np
from RealESRGAN import RealESRGAN
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from transformers import DetrImageProcessor, DetrForObjectDetection

from result_license_plate import result_license_plate

import torch.nn as nn
import torchvision.transforms as transforms
from torchvision.models import resnet50
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# load model
model_license_plate = yolov5.load('keremberke/yolov5m-license-plate')

# set model parameters
model_license_plate.conf = 0.25  # NMS confidence threshold
model_license_plate.iou = 0.45  # NMS IoU threshold
model_license_plate.agnostic = False  # NMS class-agnostic
model_license_plate.multi_label = False  # NMS multiple labels per box
model_license_plate.max_det = 1000  # maximum number of detections per image
model_license_plate.to(device)

model_RealESRGAN = RealESRGAN(device, scale=4)
model_RealESRGAN.load_weights('weights/RealESRGAN_x4.pth', download=True)

processor_trocr = TrOCRProcessor.from_pretrained('microsoft/trocr-large-printed')
model_trocr = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-large-printed').to(device)

processor_detr = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50", revision="no_timm")
model_detr = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50", revision="no_timm")

@app.route('/receive_image_url', methods=['POST'])
def receive_imgage_url():
	#Spring으로부터 JSON 객체를 전달받음
    dto_json = request.get_json()

    # JSON 응답을 생성
    response = {
        'result': '',
        'license_plate_image': '',
        'truck_image': '',
        'format': '',  # 이미지 형식에 따라 수정 가능
        'success': '',
        'message': ''
    }

    if(dto_json['url'] != '') :
        # 이미지 불러오기
        img = Image.open(requests.get(dto_json['url'], stream=True).raw).convert("RGB")
        #img = Image.open(dto_json['url'])
    else:
        #포스트맨으로 로컬에서 실험
        img = Image.open(dto_json['local'])
    

    #번호판 인식 후 ocr 결과
    license_plate_result = result_license_plate(model_license_plate, model_RealESRGAN, processor_trocr, model_trocr, processor_detr, model_detr, img, threshold=0, device=device)
    if(license_plate_result == 'no license_plate') : 
        response['success'] = False
        response['message'] = 'no license_plate'
        return jsonify(response)
    elif(license_plate_result == 'image too small') : 
        response['success'] = False
        response['message'] = 'image too small'
        return jsonify(response)
    
    license_plate_img_path = './images/license_plate_img.jpg'
    # 이미지 파일을 Base64로 인코딩
    with open(license_plate_img_path, "rb") as image_file:
        encoded_license_plate_img = base64.b64encode(image_file.read()).decode('utf-8')

    truck_img_path = './images/truck_img.jpg'
    # 이미지 파일을 Base64로 인코딩
    with open(truck_img_path, "rb") as image_file:
        encoded_truck_img = base64.b64encode(image_file.read()).decode('utf-8')


    response['result'] = license_plate_result
    response['license_plate_image'] = encoded_license_plate_img
    response['truck_image'] = encoded_truck_img
    response['format'] = 'jpeg'
    response['success'] = True
    
    #Spring으로 response 전달
    return jsonify(response)

@app.route('/receive_number_list', methods=['POST'])
def receive_number_list():
    dto_json = request.get_json()
    search_result_list = dto_json['searchResult']
    #name = dto_json['name']

    print(dto_json)

    # JSON 응답을 생성
    response = {
        'result': '',
        'success': '',
        'message': ''
    }
    
    model = resnet50(pretrained=True)
    model.eval()

    folder_path = 'D:/TechTri/img_9000/dh_feature_truck'

    total_img = os.listdir(folder_path)

    extracted_features_list = []
    extracted_name_list = []

    for img_fullname in total_img :
        img_path = folder_path + '/' + img_fullname
        img_name = img_fullname.split('.')[0]
        
        for search_result in search_result_list :
            if(img_name.split(' ')[0] == search_result) :
                # 이미지를 읽고 전처리
                img = Image.open(img_path).convert('RGB')
                transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
                ])
                img = transform(img).unsqueeze(0)

                # 모델에 이미지 전달
                with torch.no_grad():
                    x = model.conv1(img)
                    x = model.bn1(x)
                    x = model.relu(x)
                    x = model.maxpool(x)

                    x = model.layer1(x)
                    x = model.layer2(x)
                    x = model.layer3(x)
                    x = model.layer4(x)

                    features = x

                    features = nn.MaxPool2d((7,7))(features)
                    features = torch.flatten(features, 1)

                    # 피쳐 추출
                extracted_features_list.append(features.tolist()[0])
                extracted_name_list.append(img_name)

    if(len(extracted_features_list) == 0) :
        response['result'] = 'no match'

        #Spring으로 response 전달
        return jsonify(response)

    img = Image.open('./images/truck_img.jpg').convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    img = transform(img).unsqueeze(0)

    # 모델에 이미지 전달
    with torch.no_grad():
        x = model.conv1(img)
        x = model.bn1(x)
        x = model.relu(x)
        x = model.maxpool(x)

        x = model.layer1(x)
        x = model.layer2(x)
        x = model.layer3(x)
        x = model.layer4(x)

        features = x

        features = nn.MaxPool2d((7,7))(features)
        features = torch.flatten(features, 1)

    # 코사인 유사도 계산
    similarities = cosine_similarity(extracted_features_list, [features.tolist()[0]])

    # 가장 유사한 것의 인덱스 찾기
    most_similar_index_cosine = np.argmax(similarities)

    response['result'] = extracted_name_list[most_similar_index_cosine]

    #Spring으로 response 전달
    return jsonify(response)

@app.route('/test', methods=['POST'])
def test():
    # dto_json = request.get_json()

    folder_path_list = ['D:/TechTri/img_9000/dh_test']

    # JSON 응답을 생성
    response = {
        'name': [] ,
        'number': []
    }

    for folder_path in folder_path_list:
        total_img = os.listdir(folder_path)

        for img_fullname in total_img :
            img_path = folder_path + '/' + img_fullname
            img_name = img_fullname.split('.')[0]
            img = Image.open(img_path)

            # perform inference
            results = model_license_plate(img, size=640)

            # inference with test time augmentation
            results = model_license_plate(img, augment=True)

            # parse results
            predictions = results.pred[0]
            boxes = predictions[:, :4] # x1, y1, x2, y2
            scores = predictions[:, 4]
            categories = predictions[:, 5]
            license_plate_img = ''
            result = ''

            #print('번호판 정확도',scores[0])
            # show detection bounding boxes on image
            if (len(boxes) > 0) and scores[0]>=0:
                for box in boxes :
                # Get the coordinates of the first bounding box
                    x1, y1, x2, y2 = map(int, box)

                    # Crop the license plate region from the original image
                    license_plate_img = img.crop((x1, y1, x2, y2))
                    image_array = np.array(license_plate_img)
                    if(len(image_array) < 15) :
                        license_plate_img = 'image too small'
                        break

                    sr_image = model_RealESRGAN.predict(license_plate_img)

                    pixel_values_lp = processor_trocr(images=sr_image, return_tensors="pt").pixel_values.to(device)

                    generated_ids_lp = model_trocr.generate(pixel_values_lp)
                    generated_text_lp = processor_trocr.batch_decode(generated_ids_lp, skip_special_tokens=True)[0]

                    if 'DO' in generated_text_lp or 'NO' in generated_text_lp or 'SO' in generated_text_lp or 'RO' in generated_text_lp  :
                        license_plate_img = 'no license_plate'
                    else :
                        print('trocr 결과 :', generated_text_lp)
                        result = generated_text_lp
                        break

            else : license_plate_img = 'no license_plate'

            if(license_plate_img == 'no license_plate') :
                print('no license_plate')
                result = 'no license_plate'

            elif(license_plate_img == 'image too small') :
                print('image too small')
                result = 'image too small'

            response['name'].append(img_name)
            response['number'].append(result)
   

    #Spring으로 response 전달
    return jsonify(response)



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)