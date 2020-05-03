#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
import os
basepath = os.path.abspath(__file__)
parentdir = os.path.dirname(basepath)
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'waveshare_epd')

if os.path.exists(libdir):
    sys.path.append(libdir)

import logging
from waveshare_epd import epd2in13_V2
import time
from PIL import Image, ImageDraw, ImageFont #borked for macOS but should be okay on the PI
import traceback

logging.basicConfig(level=logging.DEBUG)

project = sys.argv[1]
stage = sys.argv[2]
status = sys.argv[3]
stageResult = sys.argv[4]

try:

    logging.info(sys.argv[1])
    logging.info(sys.argv[2])
    logging.info(sys.argv[3])
    logging.info(sys.argv[4])

    logging.info("epd2in13_V2 Custom")

    epd = epd2in13_V2.EPD()
    logging.info("init and Clear")

    # Drawing on the image
    font20 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 20)
    font24 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 24)

    # # partial update
    logging.info("4.show Progress...")
    image = Image.new('1', (epd.height, epd.width), 255)
    draw = ImageDraw.Draw(image)

    epd.init(epd.FULL_UPDATE)
    epd.displayPartBaseImage(epd.getbuffer(image))

    epd.init(epd.PART_UPDATE)
    draw.rectangle((120, 80, 220, 105), fill=255)
    draw.text((10, 10), project, font=font24, fill=0)
    statusString = ''
    if(status == 'inProgress'):
        statusString = 'In Progress'
    elif (status == 'completed' & stageResult == 'succeeded'):
        statusString = 'Stage Succeeded'
    elif (status == 'completed' & stageResult == 'failed'):
        statusString = 'Stage Failed'        
    draw.text((120, 80), statusString, font=font24, fill=0)
    epd.displayPartial(epd.getbuffer(image))

    time.sleep(10)

    logging.info("Clear...")
    epd.init(epd.FULL_UPDATE)
    epd.Clear(0xFF)

    logging.info("Goto Sleep...")
    epd.sleep()

except IOError as e:
    logging.info(e)

except KeyboardInterrupt:
    logging.info("ctrl + c:")
    epd2in13_V2.epdconfig.module_exit()
    exit()
