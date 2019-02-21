FROM ubuntu:latest

ENV LANG C.UTF-8

# https://github.com/pyenv/pyenv/wiki#suggested-build-environment
RUN \
  DEBIAN_FRONTEND=noninteractive; \
  apt-get update \
  && \
  apt-get install -y --no-install-recommends \
    apt-utils \
    build-essential \
    ca-certificates \
    curl \
    git \
    gnupg2 \
    libbz2-dev \
    libffi-dev \
    liblzma-dev \
    libncurses5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libssl-dev \
    libxml2-dev \
    libxmlsec1-dev \
    llvm \
    make \
    # tk-dev \
    vim \
    wget \
    xz-utils \
    zlib1g-dev \
  && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Python

# https://github.com/pyenv/pyenv-installer
RUN curl -L https://github.com/pyenv/pyenv-installer/raw/master/bin/pyenv-installer | bash
ENV PATH /root/.pyenv/bin:$PATH

# https://github.com/pyenv/pyenv
ENV PY_VERSION 3.7.2
RUN pyenv install $PY_VERSION
RUN pyenv global $PY_VERSION

ENV PATH /root/.pyenv/shims:$PATH
RUN pip install --upgrade pip
RUN pip install pipenv

# Setup app

COPY . /code
WORKDIR /code
RUN pipenv install
