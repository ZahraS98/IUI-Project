from __future__ import division

import io
import os

import spacy
from flask import Flask, request, jsonify, render_template, Response
import json
import base64

from google.cloud import speech
from pydub import AudioSegment

sp = spacy.load('en_core_web_sm')

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/blabla/key.json"

RATE = 44100

app = Flask(
    __name__,
    template_folder="./templates",
)

language_code = "en-US"

client = speech.SpeechClient()
config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=RATE,
    language_code=language_code,
)

streaming_config = speech.StreamingRecognitionConfig(
    config=config, interim_results=True
)

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

    fileType = "m4a"
    nfile_name = "inputFile." + fileType

    m4a_file = open(nfile_name, "wb")
    m4a_file.write(decoded_input)

    wav_filename = r"inputFile.wav"
    track = AudioSegment.from_file(nfile_name, format='m4a')
    file_handle = track.export(wav_filename, format='wav')
    sound = AudioSegment.from_wav(wav_filename)
    sound = sound.set_channels(1)
    sound.export("inputMono.wav", format="wav")
    with io.open("inputMono.wav", "rb") as audio_file:
        content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)
    response = client.recognize(config=config, audio=audio)

    apiResponse = []
    for result in response.results:
        apiResponse.append(format(result.alternatives[0].transcript))
        apiResponse.append(identify_slot(format(result.alternatives[0].transcript)))

    return Response(json.dumps(apiResponse), mimetype='application/json'), 201


@app.route("/textinput", methods=["POST"])
def text_response():
    input_data = request.json

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


import pandas as pd
import nltk
import sys # needed this for certain print options during debugging
import numpy as np #lmao why did we not have this before
from sklearn.feature_extraction.text import CountVectorizer
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from itertools import chain
import pickle

# Initial dataframe
df = pd.read_csv('data/final_dataset.csv', converters={'ProcessTokens': literal_eval})
df['ProcessTokens'] = df['ProcessTokens'].astype("string")

def make_initial_recommendation(searchTerms, df=df):
    new_row = df.iloc[-1,:].copy() #creating a copy of the last row of the 
    #dataset, which we will use to input the user's input

    #grabbing the new wordsoup from the user
    new_row['soup'] = searchTerms
    new_row['title'] = 'UserInput'

    #adding the new row to the dataset
    df = df.append(new_row)
#     df.iloc[-1] = searchTerms #adding the input to our new row

    #Vectorizing the entire matrix as described above!
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(df['soup'])

    #running pairwise cosine similarity 
    cosine_sim2 = cosine_similarity(count_matrix, count_matrix) #getting a similarity matrix

    #sorting cosine similarities by highest to lowest
    sim_scores = list(enumerate(cosine_sim2[-1,:]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    i = 3
    inc = 1 # we start from the 1-th row because, the 0th row is the input itself. dont want that.
    
    ranked_titles = []
    while i>=0:
        indx = sim_scores[inc][0]
        inc = inc + 1
        current_title = df['title'].iloc[indx]
        if(current_title == 'UserInput'):
            continue
        if(current_title not in chain(*ranked_titles)):
            ranked_titles.append([df['title'].iloc[indx], df['url'].iloc[indx]])
            i = i - 1

    return ranked_titles

def final_recs(user_input):
    count_vectorizer = CountVectorizer()
    # user_input = "Some string that is basically the user's input"
    user_input_count_vector = count_vectorizer.transform([user_input])
    pickled_model = pickle.load(open('lr_model.pkl', 'rb'))
    pickled_model.predict(user_input_count_vector)

    resp = make_initial_recommendation(user_input)
    return resp

app.run(host="192.168.2.131", port=3000)
