#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-105468-98d87f74/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

