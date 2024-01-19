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
model_license_plate.conf = 0.1  # NMS confidence threshold
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

model_resnet = resnet50(pretrained=True)
model_resnet.eval()

folder_path = 'D:/TechTri/img_9000/dh_feature_truck'

total_img = os.listdir(folder_path)

extracted_features_all_list = []
extracted_name_all_list = []

for img_fullname in total_img :
    img_path = folder_path + '/' + img_fullname
    img_name = img_fullname.split('.')[0]
    
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
        x = model_resnet.conv1(img)
        x = model_resnet.bn1(x)
        x = model_resnet.relu(x)
        x = model_resnet.maxpool(x)

        x = model_resnet.layer1(x)
        x = model_resnet.layer2(x)
        x = model_resnet.layer3(x)
        x = model_resnet.layer4(x)

        features = x

        features = nn.MaxPool2d((7,7))(features)
        features = torch.flatten(features, 1)

        # 피쳐 추출
    extracted_features_all_list.append(features.tolist()[0])
    extracted_name_all_list.append(img_name)

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
    
    # total_number_list = ['0179', '1193', '1211', '1221', '1296', '1379', '1459', '1504', '1507', '1547', '1602', '1892', '1917', '2207', '2218', '2238', '2459', '2466', '2559', '2689', '2799', '2821', '3089', '3196', '3210', '3214', '3319', '3381', '3399', '3403', '3611', '3644', '3694', '3722', '3827', '4042', '4133', '4174', '4251', '4383', '4627', '4700', '4706', '4727', '4847', '4983', '5014', '5027', '5058', '5171', '5283', '5537', '5683', '5739', '5922', '5946', '5989', '6322', '6438', '6650', '6744', '6755', '6868', '6926', '7132', '7236', '7252', '7262', '7270', '7375', '7381', '7482', '7702', '7822', '7837', '7857', '7885', '8056', '8135', '8206', '8342', '8521', '8536', '8561', '8609', '8642', '8897', '8905', '8941', '9105', '9135', '9136', '9138', '9570', '9695', '9776', '9786', '9816', '1050', '1093', '1164', '1215', '1270', '1328', '1446', '1513', '1679', '1812', '1838', '1889', '1932', '2075', '2132', '2162', '2166', '2184', '2225', '2297', '2409', '2445', '2483', '2671', '2755', '2764', '2977', '2997', '3013', '3275', '3436', '3561', '3667', '3767', '3899', '3952', '4029', '4121', '4156', '4191', '4340', '4362', '4524', '4537', '4562', '4576', '4579', '5044', '5088', '5109', '5126', '5143', '5222', '5445', '5459', '5527', '5543', '5822', '5916', '6032', '6084', '6241', '6262', '6388', '6409', '6608', '6646', '6732', '6769', '6807', '6877', '6884', '6992', '7011', '7027', '7072', '7117', '7194', '7263', '7287', '7290', '7346', '7501', '7562', '7570', '7589', '7601', '7640', '7882', '7946', '7974', '8073', '8150', '8540', '8579', '8613', '8778', '9030', '9116', '9139', '9159', '9160', '9183', '9185', '9239', '9256', '9287', '9315', '9335', '9420', '9432', '9451', '9553', '9669', '9738', '9792', '9798', '9969', '0719', '1021', '1931', '3129', '3153', '4002', '4926', '5007', '5473', '5591', '7286', '7666', '8532', '9381', '1126', '1921', '1999', '2070', '2078', '2600', '2818', '2830', '3960', '5063', '5362', '6044', '6075', '6869', '7310', '8526', '9113', '9173']

    model = resnet50(pretrained=True)
    model.eval()

    folder_path = 'D:/TechTri/img_9000/dh_feature_truck'

    total_img = os.listdir(folder_path)

    extracted_features_list = []
    extracted_name_list = []

    if(search_result_list == '') : 
        extracted_features_list = extracted_features_all_list
        extracted_name_list = extracted_name_all_list

    else :
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
            extracted_features_list = extracted_features_all_list
            extracted_name_list = extracted_name_all_list
        

    img = Image.open('./images/truck_img.jpg').convert('RGB')
    #img = Image.open('D:/TechTri/img_9000/dh_ocr_fail_truck/' + name + '.jpg').convert('RGB')
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

    # folder_path_list = ['D:/TechTri/img_9000/dh_ocr_fail']

    # JSON 응답을 생성
    response = {
        'name': [] ,
        'number': []
    }

    # for folder_path in folder_path_list:
    #     total_img = os.listdir(folder_path)

    #     for img_fullname in total_img :
    #         img_path = folder_path + '/' + img_fullname
    #         img_name = img_fullname.split('.')[0]
    #         img = Image.open(img_path)

    #         # perform inference
    #         results = model_license_plate(img, size=640)

    #         # inference with test time augmentation
    #         results = model_license_plate(img, augment=True)

    #         # parse results
    #         predictions = results.pred[0]
    #         boxes = predictions[:, :4] # x1, y1, x2, y2
    #         scores = predictions[:, 4]
    #         categories = predictions[:, 5]
    #         license_plate_img = ''
    #         result = ''

    #         #print('번호판 정확도',scores[0])
    #         # show detection bounding boxes on image
    #         if (len(boxes) > 0) and scores[0]>=0:
    #             for box in boxes :
    #             # Get the coordinates of the first bounding box
    #                 x1, y1, x2, y2 = map(int, box)

    #                 # Crop the license plate region from the original image
    #                 license_plate_img = img.crop((x1, y1, x2, y2))
    #                 image_array = np.array(license_plate_img)
    #                 if(len(image_array) < 15) :
    #                     license_plate_img = 'image too small'
    #                     break

    #                 sr_image = model_RealESRGAN.predict(license_plate_img)

    #                 pixel_values_lp = processor_trocr(images=sr_image, return_tensors="pt").pixel_values.to(device)

    #                 generated_ids_lp = model_trocr.generate(pixel_values_lp)
    #                 generated_text_lp = processor_trocr.batch_decode(generated_ids_lp, skip_special_tokens=True)[0]

    #                 if 'DO' in generated_text_lp or 'NO' in generated_text_lp or 'SO' in generated_text_lp or 'RO' in generated_text_lp  :
    #                     license_plate_img = 'no license_plate'
    #                 else :
    #                     print('trocr 결과 :', generated_text_lp)
    #                     result = generated_text_lp
    #                     break

    #         else : license_plate_img = 'no license_plate'

    #         if(license_plate_img == 'no license_plate') :
    #             print('no license_plate')
    #             result = 'no license_plate'

    #         elif(license_plate_img == 'image too small') :
    #             print('image too small')
    #             result = 'image too small'

    #         response['name'].append(img_name)
    #         response['number'].append(result)

    #         # 텍스트를 저장할 파일 경로 및 이름 지정
    #         file_path = 'D:/TechTri/img_9000/ocr_result.txt'

    #         # 텍스트를 파일에 쓰기 모드로 열기
    #         with open(file_path, 'a') as file:
    #             # 파일에 쓸 텍스트 작성
    #             text_to_write = '\n' + img_name + ',' + result
    #             file.write(text_to_write)

    response['name'] = ['1296 (2)', '1296 (4)', '1296 (5)', '1296', '1379 (10)', '1379 (11)', '1379 (14)', '1379 (16)', '1379 (17)', '1379 (2)', '1379 (3)', '1379 (4)', '1379 (5)', '1379 (7)', '1379 (8)', '1379 (9)', '1459 (10)', '1459 (12)', '1459 (13)', '1459 (14)', '1459 (15)', '1459 (18)', '1459 (19)', '1459 (2)', '1459 (20)', '1459 (22)', '1459 (23)', '1459 (25)', '1459 (29)', '1459 (3)', '1459 (30)', '1459 (31)', '1459 (33)', '1459 (35)', '1459 (5)', '1459 (7)', '1459 (8)', '1459 (9)', '1459', '1504 (11)', '1504 (16)', '1504 (4)', '1504 (6)', '1504 (7)', '1504 (8)', '1547 (13)', '1547 (20)', '1547 (4)', '1547 (7)', '1602 (10)', '1602 (11)', '1602 (12)', '1602 (13)', '1602 (17)', '1602 (18)', '1602 (19)', '1602 (2)', '1602 (20)', '1602 (23)', '1602 (24)', '1602 (25)', '1602 (27)', '1602 (3)', '1602 (31)', '1602 (33)', '1602 (34)', '1602 (35)', '1602 (37)', '1602 (38)', '1602 (39)', '1602 (41)', '1602 (42)', '1602 (46)', '1602 (48)', '1602 (5)', '1602 (50)', '1602 (54)', '1602 (56)', '1602 (6)', '1602 (60)', '1602 (9)', '1602', '1892 (10)', '1892 (11)', '1892 (12)', '1892 (13)', '1892 (14)', '1892 (15)', '1892 (2)', '1892 (24)', '1892 (27)', '1892 (3)', '1892 (31)', '1892 (4)', '1892 (40)', '1892 (42)', '1892 (5)', '1892 (6)', '1892 (7)', '1892 (9)', '1892', '2207 (3)', '2207 (4)', '2218 (10)', '2218 (12)', '2218 (16)', '2218 (4)', '2218 (7)', '2218 (8)', '2689 (6)', '2689 (7)', '2799 (12)', '2799 (13)', '2799 (14)', '2799 (15)', '2799 (16)', '2799 (19)', '2799 (2)', '2799 (27)', '2799 (28)', '2799 (3)', '2799 (30)', '2799 (34)', '2799 (35)', '2799 (38)', '2799 (41)', '2799 (5)', '2799 (9)', '2799', '2821 (3)', '3214 (13)', '3214 (16)', '3214 (32)', '3214 (7)', '3319 (10)', '3319 (11)', '3319 (12)', '3319 (14)', '3319 (15)', '3319 (2)', '3319 (3)', '3319 (4)', '3319 (5)', '3319 (6)', '3319 (7)', '3319 (8)', '3319 (9)', '3381 (10)', '3381 (14)', '3381 (15)', '3381 (19)', '3381 (24)', '3381 (25)', '3381 (3)', '3381 (31)', '3381 (39)', '3381 (41)', '3381 (5)', '3381 (8)', '3381', '3399 (10)', '3399 (11)', '3399 (15)', '3399 (17)', '3399 (23)', '3399 (24)', '3399 (6)', '3399 (7)', '3399 (9)', '3399', '3644 (2)', '3644 (3)', '3644 (4)', '3644 (5)', '3644', '3694 (12)', '3694 (3)', '3694 (4)', '3694 (5)', '3694 (7)', '3694 (8)', '3694 (9)', '3694', '4174 (2)', '4174', '4383 (11)', '4383 (12)', '4383 (13)', '4383 (15)', '4383 (16)', '4383 (17)', '4383 (18)', '4383 (19)', '4383 (20)', '4383 (4)', '4383 (5)', '4383 (6)', '4383 (7)', '4700 (17)', '4727 (10)', '4727 (11)', '4727 (2)', '4727 (3)', '4727 (4)', '4727 (5)', '4727 (6)', '4727 (7)', '4727 (8)', '4727 (9)', '6322 (3)', '6650 (2)', '6650', '6755 (14)', '6755 (3)', '6755 (4)', '6755 (5)', '6755 (6)', '6755 (9)', '6755', '6868 (2)', '6868', '7236 (2)', '7236 (3)', '7236 (4)', '7236', '7252 (3)', '7252 (4)', '7252 (5)', '7252 (6)', '7252', '7375 (19)', '7375 (22)', '7375 (23)', '7375 (24)', '7375 (25)', '7375 (27)', '7375 (29)', '7375 (3)', '7375 (30)', '7375 (31)', '7375 (32)', '7375 (33)', '7375 (34)', '7375 (35)', '7375 (36)', '7375 (37)', '7375 (38)', '7375 (39)', '7375 (41)', '7375 (42)', '7375 (43)', '7375 (44)', '7375 (45)', '7375 (46)', '7375 (47)', '7375 (48)', '7375 (49)', '7375 (50)', '7375 (51)', '7375 (52)', '7375 (53)', '7375 (54)', '7375 (55)', '7375 (56)', '7375 (57)', '7375 (58)', '7375 (59)', '7375 (60)', '7375 (61)', '7375 (62)', '7375 (63)', '7375 (64)', '7375 (65)', '7375 (67)', '7375 (69)', '7375 (70)', '7375 (71)', '7375 (73)', '7375 (74)', '7381 (2)', '7381 (4)', '7381 (5)', '7381', '7702 (5)', '7822 (15)', '7822 (5)', '7837 (4)', '7837', '7857 (11)', '7857 (13)', '7857 (8)', '7885 (10)', '7885 (12)', '7885 (13)', '7885 (15)', '7885 (17)', '7885 (2)', '7885 (20)', '7885 (21)', '7885 (24)', '7885 (26)', '7885 (28)', '7885 (29)', '7885 (30)', '7885 (35)', '7885 (36)', '7885 (38)', '7885 (39)', '7885 (4)', '7885 (40)', '7885 (8)', '7885', '8056 (3)', '8056 (6)', '8206 (10)', '8206 (13)', '8206 (15)', '8206 (16)', '8206 (17)', '8206 (18)', '8206 (19)', '8206 (2)', '8206 (20)', '8206 (23)', '8206 (24)', '8206 (25)', '8206 (26)', '8206 (27)', '8206 (28)', '8206 (29)', '8206 (30)', '8206 (31)', '8206 (32)', '8206 (4)', '8206 (5)', '8206 (8)', '8206 (9)', '8342 (17)', '8342 (2)', '8342 (22)', '8342 (25)', '8342 (3)', '8342 (4)', '8342 (5)', '8342', '8521 (2)', '8521 (4)', '8536 (2)', '8536 (3)', '8536 (6)', '8536 (8)', '8536 (9)', '8536', '8561 (2)', '8561 (3)', '8561 (4)', '8561 (5)', '8561 (6)', '8561 (8)', '8561', '8897 (14)', '8897 (16)', '8897 (17)', '8897 (2)', '8897 (3)', '8897 (7)', '8905 (10)', '8941 (10)', '8941 (13)', '8941 (19)', '8941 (20)', '8941 (22)', '8941 (23)', '8941 (25)', '8941 (26)', '8941 (3)', '8941 (9)', '8941', '9105 (10)', '9105 (15)', '9105 (30)', '9105 (38)', '9105 (43)', '9105 (6)', '9135 (4)', '9135 (8)', '9570 (10)', '9570 (15)', '9570 (31)', '9570 (4)', '9570 (6)', '9695 (13)', '9695 (14)', '9695 (15)', '9695 (16)', '9776 (2)', '9776 (8)', '9776 (9)', '9786 (3)', '9786 (6)', '9786 (9)']
    response['number'] = ['020', '1294', '', '', '', '', '', '', '', '', '', '', '', '', '88', '', '1458', '0459', '1959', '1259', '', '459', '8149', '0259', '1450', '', '9149', '', '0149', '000', '0159', '1159', '4159', '0149', '1259', '749', '', '1458', '9189', '', '504', '', '050', '', '050', '7', '047', '4157', '867', '3160', '', '160', '060', '02', '160', '1160', '02', '160', '602', '02', '160', '160', '112', '1160', '', '602', '120', '160', '7602', '602', '', '02', '', '1160', '1160', '', '9162', '160', '7602', '160', '060', '802', '', '92', '', '', '', '', '', '', '', '', '', '', '892', '892', '', '', '1872', '', '', '0207', '8227', '18', '221', '4228', '18', '1221', '18', '0260', '0268', '799', '279', '0799', '799', '6799', '0799', '', '', '7799', '6999', '99', '299', '0799', '0799', '0799', '6299', '279', '99', '0281', '4324', '3714', '3274', '3911', '', '', '', '', '', '', '', '', '', '', '', '', '', '433', '', '3981', '4338', '0981', '5381', '0338', '5381', '0398', '3981', '3981', '0338', '', '5399', '3379', '5399', '5379', '5399', '5399', '5399', '5399', '5399', '5399', '364', '3364', '3384', '3364', '1364', '4394', '9894', '4369', '9369', '9369', '1369', '5624', '', '474', '474', '043', '4583', '', '', '2383', '055', '', '', '2395', '4583', '', '4583', '4385', '8700', '', '', '2727', '2727', '', '000', '', '', '2727', '', '0322', '8650', '4650', '6', '2018', '2018', '9676', '6765', '6', '6765', '6858', '6858', '738', '7238', '1738', '23', '', '', '', '', '', '7376', '', '075', '', '', '0375', '079', '7376', '', '', '075', '', '3', '', '', '', '7575', '', '175', '075', '075', '', '', '000', '075', '8', '', '095', '', '', '', '', '', '', '', '075', '175', '', '075', '000', '', '88', '', '', '', '7575', '', '', '', '7589', '7891', '1381', '9891', '7021', '', '1822', '7827', '', '7657', '', '0', '', '', '', '', '7835', '', '', '7835', '', '7865', '', '', '', '', '7865', '', '7886', '', '', '', '7386', '6056', '0056', '8208', '', '', '', '806', '7', '', '6204', '8208', '', '', '', '', '2', '', '', '8706', '', '8208', '2', '2', '8208', '7', '342', '003', '342', '34', '', '2', '', '', '521', '5216', '8556', '856', '1856', '616', '0536', '8656', '0856', '0856', '8591', '0856', '0851', '8581', '8591', '897', '897', '897', '089', '', '4897', '8805', '5941', '', '', '', '941', '941', '', '', '941', '', '941', '105', '105', '7105', '105', '7105', '', '9185', '9136', '570', '095', '9590', '095', '7870', '1995', '7675', '', '9999', '0976', '2016', '2617', '1786', '946', '2016']
    #Spring으로 response 전달
    return jsonify(response)



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)