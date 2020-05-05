#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
import os
basepath = os.path.abspath(__file__)
parentdir = os.path.dirname(basepath)
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')

if os.path.exists(libdir):
    sys.path.append(libdir)

import logging
from waveshare_epd import epd2in13_V2
import time
from PIL import Image, ImageDraw, ImageFont #borked for macOS but should be okay on the PI
import traceback

logging.basicConfig(level=logging.DEBUG)

try:

    project = ''
    stage = ''
    status = ''
    stageResult = ''

    project = sys.argv[1]
    stage = sys.argv[2]
    status = sys.argv[3]
    stageResult = sys.argv[4]

    logging.info("epd2in13_V2 Custom")

    epd = epd2in13_V2.EPD()
    
    # Drawing on the image
    font20 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 20)
    font24 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 24)

    # # partial update
    image = Image.new('1', (epd.height, epd.width), 255)
    draw = ImageDraw.Draw(image)

    if status == 'inProgress' or status == 'running':    
        logging.info("init and Clear")
        epd.init(epd.FULL_UPDATE)
        #epd.Clear(0xFF)
        epd.displayPartBaseImage(epd.getbuffer(image))

    epd.init(epd.PART_UPDATE)
    draw.rectangle((120, 80, 220, 105), fill=255)
    draw.text((10, 10), project, font=font24, fill=0)
    draw.text((10, 45), stage, font=font24, fill=0)
    statusString = ''

    if status == 'inProgress' or status == 'running':
        statusString = 'In Progress'
        print('In Progress')
    elif status == 'completed' and stageResult == 'succeeded':
        statusString = 'Stage Succeeded'
        print('Stage Succeeded')
    elif status == 'completed' and stageResult == 'failed':
        statusString = 'Stage Failed'
        print('Stage Failed')

    draw.text((100, 80), statusString, font=font24, fill=0)
    epd.displayPartial(epd.getbuffer(image))

    if status == 'completed':
        time.sleep(30)
        logging.info("Clear...")
        epd.init(epd.FULL_UPDATE)
        epd.Clear(0xFF)
        logging.info("Goto Sleep...")
        epd.sleep()

    print(sys.argv[1])
    print(sys.argv[2])
    print(sys.argv[3])
    print(sys.argv[4])

except IOError as e:
    logging.info(e)
    print(e)
except KeyboardInterrupt:
    logging.info("ctrl + c:")
    epd2in13_V2.epdconfig.module_exit()
    exit()
