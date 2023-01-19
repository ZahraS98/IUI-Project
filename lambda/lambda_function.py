# -*- coding: utf-8 -*-

# This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK for Python.
# Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
# session persistence, api calls, and more.
# This sample is built using the handler classes approach in skill builder.
import logging
import random

import ask_sdk_core.utils as ask_utils
from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.dispatch_components import AbstractExceptionHandler
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_core.utils import is_intent_name, get_supported_interfaces, is_request_type
from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_model.interfaces.alexa.presentation.apl import RenderDocumentDirective

from ask_sdk_model import Response

import webbrowser

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

APL_DOCUMENT_ID = "video"

APL_DOCUMENT_TOKEN = "documentToken"

DATASOURCE = {
    "simpleTextTemplateData": {
        "type": "object",
        "properties": {
            "backgroundImage": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/background-green.png",
            "foregroundImageLocation": "left",
            "foregroundImageSource": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/asparagus.jpeg",
            "headerTitle": "Asparagus",
            "headerSubtitle": "",
            "hintText": "Try, \"Alexa, next question\"",
            "headerAttributionImage": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/logo-world-of-plants-2.png",
            "primaryText": "Asparagus is a member of the Lily family. Plants in the lily family have evolved a close relationship with pollinators. Therefore, they typically have elaborate blooms. Asparagus is a member of the Lily family. Plants in the lily family have evolved a close relationship with pollinators. Therefore, they typically have elaborate blooms. Asparagus is a member of the Lily family. Plants in the lily family have evolved a close relationship with pollinators. Therefore, they typically have elaborate blooms. Asparagus is a member of the Lily family. Plants in the lily family have evolved a close relationship with pollinators. Therefore, they typically have elaborate blooms. ",
            "textAlignment": "start",
            "titleText": "your mom's a hoe"
        }
    }
}

genre_explanation = {
    "action": "In action games like Donkey Kong, Call Of Duty or Skyrim the player is the center of the action, which is mainly comprised of physical challenges players must overcome.",
    "party": "Designed for multiple players, party games like Mario Party usually feature mini game competitions with participants competing against each other to finish a challenge before the others",
    "multiplayer": "Multiplayer video games are designed for multiple players. Oftentimes they either play in teams or against each other.",
    "sport": "Sports games like Fifa simulate sports like golf, football or soccer. They can also include Olympic sports like skiing, and even pub sports like darts and pool.",
    "simulator": "Games in the simulation genre like The Sims or Euro Truck Simulator are designed to emulate real or fictional reality and to simulate a real situation or event.",
    "strategy": "The strategy genre has a lot of different subgenres. In general one can say that strategy games require players to use carefully developed strategy and tactics to overcome challenges. Examples for famous strategy games would be Age of Empires or Civilization",
    "sandbox": "Sandbox games like Dragon Quest or The Elder Scrolls are a subcategory of role play games. In this type of games the player has few limits on his or her character and is free to wander and change the virtual world at his or her liking. They are also sometimes called Open-World games.",
    "puzzle": "Puzzle games put the player’s problem-solving skills to the test, requiring them to recognize patterns, solve sequences, and complete words. While many action and adventure games incorporate puzzle aspects into their level design, a real puzzle game prioritizes problem solving as the primary gameplay activity.",
    "horror": "Horror oftentimes is a subgenre of the genere survival, where like in Resident Evil one has to survive in a hostile environment with little resources. These types of games portray grisly and gruesome settings and are therefore intended for a mature audience",
    "adventure": "In adventure games, players usually interact with their environment and other characters to solve puzzles with clues to progress the story or gameplay.",
    "battle-royale": "Battle Royale belongs to the action genre. It is typically a multiplayer online video game that combines last-man-standing gameplay with survival, exploration, and scavenging elements of a survival game. Two of the most famous battle royale games are Call of Duty Warzone and Fortnite",
    "survival": "In survival games like Subnautica or Stardew Valley the player is stranded or separated from others and must work alone to survive and complete a goal. The player generally starts out with a minimal amount of equipment and must attempt to remain alive as long as possible by crafting weapons, shelters, and collecting resources",
    "stealth": "Like in Assassin's Creed the current stealth game's basic gameplay elements are to avoid battle, make as little noise as possible, and strike foes from the shadows and behind. Completing goals without being discovered by enemies, sometimes known as “ghosting,” is a popular strategy in stealth games.",
    "platformer": "In platform games like Super-Mario or Donkey Kong the user's character will navigate terrain, platforms, ladders, and other puzzles and try to reach the end of the level alive.",
    "fighting": "A fighting game like Super Smash Bros or Mortal Kombat is a video game genre in which two or more players fight each other. Hand-to-hand combat often involving some type of martial-arts is used by the characters in most battles.",
    "real-time-strategy": "Real-time strategy games require the player to collect and maintain resources, like bases, while advancing and developing both resources and combat units. Starcraft is the most popular r. t. s.",
    "role-playing": "In Role-Playing games like the witcher three wildhunt or cyberpunk the player assumes the role of a character that grows in strength and experience over the course of the game. The player is required to overcome difficult challenges and defeat monsters in order to gain experience points which allow the player to gain new abilities once a specific amount is obtained.",
    "shooting": "The shooter video game genre, is a subgenre of action video games in which the player’s primary goal is to defeat opponents with the weapons available to it. These weapons are usually rifles or other long-range weapons that can be used in conjunction with other items"
}

genres = ["action", "party", "multiplayer", "sports", "simulator", "strategy", "sandbox", "puzzle", "horror",
          "adventure", "battle-royale", "survival", "stealth", "platformer", "fighting", "real-time-strategy",
          "role-play", "shooter"]

skill_name = "game finder"
help_text = ("Please tell me your favourite video game genres. You can say "
             "I really enjoy shooters")


class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool

        return ask_utils.is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speech = "Welcome to g. g. easy, the alexa video game recommender, to help you and your friends find a video game that you all like to play."

        handler_input.response_builder.speak(
            speech + " " + help_text).ask(help_text)

        return handler_input.response_builder.response


class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "What do you need help with?"

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


class CancelOrStopIntentHandler(AbstractRequestHandler):
    """Single handler for Cancel and Stop Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return (ask_utils.is_intent_name("AMAZON.CancelIntent")(handler_input) or
                ask_utils.is_intent_name("AMAZON.StopIntent")(handler_input))

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "Goodbye!"

        return (
            handler_input.response_builder
            .speak(speak_output)
            .response
        )


class FallbackIntentHandler(AbstractRequestHandler):
    """Single handler for Fallback Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.FallbackIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        logger.info("In FallbackIntentHandler")
        speech = "Hmm, I'm not sure. You can say Hello or Help. What would you like to do?"
        reprompt = "I didn't catch that. What can I help you with?"

        return handler_input.response_builder.speak(speech).ask(reprompt).response


class SessionEndedRequestHandler(AbstractRequestHandler):
    """Handler for Session End."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("SessionEndedRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response

        # Any cleanup logic goes here.

        return handler_input.response_builder.response


class GiveGenreDefinitionIntentHandler(AbstractRequestHandler):

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool

        return ask_utils.is_request_type("GiveGenreDefinitionIntent")(handler_input)

    def handle(self, handler_input):

        slots = handler_input.request_envelope.request.intent.slots

        if "game type" in slots:
            type = slots["game type"].value
            speak_output = genre_explanation.get(type)
            repromt = (
                "You can ask me about other video game genres you don't know about by saying""Please tell me more about r. p. g. for example ")
        else:
            samples = list(random.sample(genres, 2))
            speak_output = "I'm not sure I know about this genre. For example I can give you definitions about {} and {} games".format(
                samples[0], samples[1])
            repromt = "I'm not sure I know about this genre. You can ask me about a genre by saying please explain the action genre for example"

        handler_input.response_builder.speak(speak_output).ask(repromt)

        return handler_input.response_builder.response


class NeedGameIntentHandler(AbstractRequestHandler):
    """Handler for Need Game Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("NeedGameIntent")(handler_input)

    def supports_apl(self, handler_input):
        # Checks whether APL is supported by the User's device
        supported_interfaces = get_supported_interfaces(
            handler_input)
        return supported_interfaces.alexa_presentation_apl != None

    def launch_screen(self, handler_input):
        # Only add APL directive if User's device supports APL
        if self.supports_apl(handler_input):
            handler_input.response_builder.add_directive(
                RenderDocumentDirective(
                    token=APL_DOCUMENT_TOKEN,
                    document={
                        "type": "Link",
                        "src": f"doc://alexa/apl/documents/{APL_DOCUMENT_ID}"
                    },
                    datasources=DATASOURCE
                )
            )

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        speak_output = "Of course. Here are some videos to help you choose."

        self.launch_screen(handler_input)
        # return handler_input.response_builder.response

        """
        # then make a url variable
        url = "https://www.geeksforgeeks.org"
        # then call the default open method described above
        print(url)
        webbrowser.open(url)
        """

        return (

            handler_input.response_builder
            .speak(speak_output)
            # .ask("add a reprompt if you want to keep the session open for the user to respond")
            .response
        )


class IntentReflectorHandler(AbstractRequestHandler):
    """The intent reflector is used for interaction model testing and debugging.
    It will simply repeat the intent the user said. You can create custom handlers
    for your intents by defining them above, then also adding them to the request
    handler chain below.
    """

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("IntentRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        intent_name = ask_utils.get_intent_name(handler_input)
        speak_output = "You just triggered " + intent_name + "."

        return (
            handler_input.response_builder
            .speak(speak_output)
            # .ask("add a reprompt if you want to keep the session open for the user to respond")
            .response
        )


class CatchAllExceptionHandler(AbstractExceptionHandler):
    """Generic error handling to capture any syntax or routing errors. If you receive an error
    stating the request handler chain is not found, you have not implemented a handler for
    the intent being invoked or included it in the skill builder below.
    """

    def can_handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> bool
        return True

    def handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> Response
        logger.error(exception, exc_info=True)

        speak_output = "Sorry, I had trouble doing what you asked. Please try again."

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


# The SkillBuilder object acts as the entry point for your skill, routing all request and response
# payloads to the handlers above. Make sure any new handlers or interceptors you've
# defined are included below. The order matters - they're processed top to bottom.

sb = SkillBuilder()

sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(FallbackIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
sb.add_request_handler(GiveGenreDefinitionIntentHandler())
sb.add_request_handler(NeedGameIntentHandler())
sb.add_request_handler(
    IntentReflectorHandler())  # make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers

sb.add_exception_handler(CatchAllExceptionHandler())

lambda_handler = sb.lambda_handler()