from __future__ import division

import io
import os

import spacy
from flask import Flask, request, jsonify, render_template
import json
import base64

#from google.cloud import speech

sp = spacy.load('en_core_web_sm')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/pierre/key.json"

RATE = 44100

app = Flask(
    __name__,
    template_folder="./templates",
)

language_code = "en-US"

#client = speech.SpeechClient()
#config = speech.RecognitionConfig(
#    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#    sample_rate_hertz=RATE,
#    language_code=language_code,
#)

#streaming_config = speech.StreamingRecognitionConfig(
#    config=config, interim_results=True
#)

chat = []
files = []

slot_game_type_dictionary = {}

game_type = [
    "sport",
    "fighting",
    "party",
    "multiplayer",
    "simulator",
    "strategy",
    "sandbox",
    "puzzle",
    "horror",
    "adventure",
    "battle royale",
    "survival",
    "stealth",
    "platformer",
    "role playing",
    "shooting"
]

game_type_slot = [
    ["racing", "skiing", "sports", "sport"],
    ["fighting", "combat", "melee combat", "beat them ups", "beat 'em ups", "brawler", "close ranged combat", "combat"],
    ["party"],
    ["multiplayer", "massively multiplayer online", "massively multiplayer", "MMO"],
    ["simulator", "simulation"],
    ["grand strategy wargames", "tower defense", "Wargames", "turn based tactics", "TBT", "turn based strategy", "TBS",
     "ARTS", "multiplayer online battle arena", "MOBA", "real time tactic", "RTT", "real time strategy", "RTS",
     "auto battler", "auto battle", "artillery", "4X"],
    ["sandbox"],
    ["match", "matching", "hidden object", "riddle", "puzzle"],
    ["horror", "fright"],
    ["adventure", "visual novels"],
    ["battle royale"],
    ["survival"],
    ["stealth", "sneak", "sneaky"],
    ["platformer", "platform", "platforming"],
    ["role playing", "storyline", "first person roleplay", "role play", "FPRPG", "roguelike", "RPG"],
    ["shooting", "FPS", "TPS", "shoot them ups", "shoot 'em ups", "hero shooters", "first person shooters", "shooter"]
]

for i in range(len(game_type)):
    for word in game_type_slot[i]:
        slot_game_type_dictionary[word] = game_type[i]


def identify_slot(input):
    # Take a String as an input and tries to find a verb using POS.
    # If it finds one, it prints it along with the text that follows as an <actikon,target> couple.
    # If there are multiple sentences, it print every couple present in each sentence.

    slots = []

    i = 0
    actikon = ""
    objet = ""

    my_doc = sp(input)
    token_list = []
    for token in my_doc:
        token_list.append(token.text)

    filtered_sentence = ""

    for word in token_list:
        lexeme = sp.vocab[word]
        if lexeme.is_stop == False:
            filtered_sentence += (word + " ")

    sentence = sp(filtered_sentence)

    for word in sentence:
        if actikon == "":
            if word.pos_ == "VERB" or word.pos_ == "NOUN" or word.pos_ == "ADP":
                # print(word, word.pos_)
                # print(sentence[i])
                actikon = str(sentence[i])

        elif actikon != "":
            """

            if word.pos_ == "PUNCT":
                objet = objet[:-1]
                print("<" + actikon + "," + objet + ">")
                actikon = ""
                objet = ""
            else:"""
            if str(word) in slot_game_type_dictionary.keys():
                objet += next(v for k, v in slot_game_type_dictionary.items() if str(word) in k) + " "
                slots.append(next(v for k, v in slot_game_type_dictionary.items() if str(word) in k))
            else:
                objet += str(sentence[i]) + " "
        i += 1

    return slots


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/input", methods=["GET", "POST"])
def audioResponse():
    input_data = json.loads(request.data)
    input_file = input_data["inputFile"]
    files.append(input_file)

    decoded_input = base64.b64decode(input_file)

    fileType = "wav"
    nfile_name = "inputFile." + fileType
    input_file.name = nfile_name
    input_file.save(os.path.join("input", input_file.filename))
    os.rename("input/" + input_file.filename, "input/" + nfile_name)

    with io.open(nfile_name, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)

    response = client.recognize(config=config, audio=audio)

    global apiResponse

    for result in response.results:
        apiResponse = identify_slot(format(result.alternatives[0].transcript))

    return jsonify(apiResponse), 201


@app.route("/textinput", methods=["POST"])
def text_response():
    input_data = request.form

    if input_data is None:
        return jsonify({"error": "Input is None"}), 404

    text = input_data["text"]
    chat.append(text)
    apiResponse = identify_slot(text)

    return jsonify(apiResponse), 201


@app.route("/textinput", methods=["GET"])
def get_text():
    return jsonify(chat)


@app.route("/test", methods=["GET"])
def test():
    return jsonify("something")


app.run(host="192.168.2.131", port=3000)
