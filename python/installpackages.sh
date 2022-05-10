#!/bin/bash

source compmod_env/bin/activate
python3 -m pip install $1/finitestateautomata/
python3 -m pip install $1/markovchains/
python3 -m pip install $1/dataflow/
python3 -m pip install $1/cmtrace/
deactivate
