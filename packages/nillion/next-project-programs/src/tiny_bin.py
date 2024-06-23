from nada_dsl import *

def nada_main():
  guess = Party(name="Guess")
  bin = Party(name="Bin")

  guess_input = SecretInteger(Input(name="guess_input", party=guess))
  retrieve_input = SecretInteger(Input(name="retrieve_input", party=bin))

  result = retrieve_input == guess_input

  return [Output(result, "my_output", guess)]
