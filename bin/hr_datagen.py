#! /usr/bin/python3

#
# Usage (run in background):
# python3 hr_datagen.py &
#
# Error Log:
# hr_datagen.log
#

import os
import random
import time
import logging

from requests.exceptions import HTTPError
from m2x.client import M2XClient

def handle_error(logger, device, last_response):
  logger.error('Error adding value to Device Heart Rate stream')
  logger.error('Device ID: ' + device)
  logger.error('Status Code: ' + str(last_response.status))
  logger.error('Raw Response: ' + str(last_response.raw))
  logger.error('***********************************************\n')

# Connect to M2X and get Device/Stream
client = M2XClient(key=os.environ['M2X_API_KEY'])
device = client.device(os.environ['M2X_HR_DEVICE'])
stream = device.stream('heart-rate')

# Prepare error logger
logger = logging.getLogger('hr_datagen')
hdlr = logging.FileHandler('hr_datagen.log')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr) 
logger.setLevel(logging.WARNING)

# Push Heart Rate Data to M2X
while True:
  with open('data/heart_rate.data') as data:
      for hr in data:
        time.sleep(1)
        try:
          stream.add_value(hr)
        except:
          handle_error(logger, device.id, client.last_response)
          continue
