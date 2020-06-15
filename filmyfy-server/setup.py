"""
Hello World app for running Python apps on Bluemix
"""

# Always prefer setuptools over distutils
from setuptools import setup, find_packages
# To use a consistent encoding
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='filmyfy',
    version='1.0.0',
    description='REST API for filmyfy app running on Bluemix',
    url='https://https://github.com/PeKne/filmyfy',
    license='Apache-2.0'
)
