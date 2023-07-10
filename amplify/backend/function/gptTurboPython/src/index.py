import json
import openai
import boto3
import os

# CONFIG ---------------------
ENCRYPTED = os.environ['OPENAI_KEY']
ssm = boto3.client('ssm')

openai.api_key = ssm.get_parameter(
    Name=ENCRYPTED, WithDecryption=True)['Parameter']['Value']

FOLDER = 'public/sounds'
S3_BUCKET_NAME = "recoveryimageaudio9cf45a58988249b58ea28ebeffd19151316-dev"

# PROPS ----------------------


def list_s3_sounds():
    s3 = boto3.resource("s3")
    my_bucket = s3.Bucket(S3_BUCKET_NAME)

    TOTAL_SOUNDS = []
    for objects in my_bucket.objects.filter(Prefix=FOLDER):
        path = objects.key
        fileName = path.replace('public/sounds/', '')

        if (not fileName):
            continue

        TOTAL_SOUNDS.append(fileName)

    return TOTAL_SOUNDS


sound_data = list_s3_sounds()

MODEL_COMPORT = f"""
Vas a recibir un string, primero identifica el nombre del animal y sus caracteristicas y retornarlo en inglés, luego de los siguientes datos: {sound_data}, busca el sonido del animal que haria el identificaste. Si no encuentras un animal o  sonido solo devuelve un string vacío en su posición. ejemplo, string: "perro corriendo rapido" => "dog running,perro.mp3"
"""


def buildResponse(status, text):
    response = {}
    response["text"] = text
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(response),
    }

# LAMBDA -----------------------


def handler(event, context):
    data = json.loads(event["body"])

    openai_data = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": MODEL_COMPORT},
            {"role": "user", "content": "un burro bebe"},
            {"role": "assistant", "content": "small donkey,BURRO.mp3"},
            {"role": "user", "content": "caballo corriendo veloz"},
            {"role": "assistant",
                "content": "horse running,CABALLO.wav"},
            {"role": "user", "content": "jajajjaja"},
            {"role": "assistant", "content": ","},
            {"role": "user", "content": data['prompt']}
        ],
        temperature=0.9,
        frequency_penalty=0.5,
        presence_penalty=1.0
    )

    text = openai_data['choices'][0]['message']["content"]
    return buildResponse(200, text)
