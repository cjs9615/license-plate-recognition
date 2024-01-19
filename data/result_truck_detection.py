import torch
import sys

#트럭 객체 추출 모델 : facebook/detr-resnet-50
def result_truck_detection(processor, model ,img, x1, y1, x2, y2, threshold):
    inputs = processor(images=img, return_tensors="pt")
    outputs = model(**inputs)

    # convert outputs (bounding boxes and class logits) to COCO API
    # let's only keep detections with score > 0.9
    target_sizes = torch.tensor([img.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=threshold)[0]

    box_size = sys.maxsize

    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        box = [round(i, 2) for i in box.tolist()]

        # 번호판을 포함하는 트럭만 추출
        if(x1 < box[0] or y1 < box[1] or x2 > box[2] or y2 > box[3]) : continue

        # 제일 작은 박스의 트럭 추출
        if(box_size > ((box[2] - box[0]) * (box[3] - box[1]))) :
            box_size = (box[2] - box[0]) * (box[3] - box[1])

            truck_img = img.crop((box[0], box[1], box[2], box[3]))
            truck_img.save('./images/' + 'truck_img' + '.jpg','JPEG')