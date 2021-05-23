FROM jrottenberg/ffmpeg:4.1-alpine
FROM node:15-alpine

# set the timezone
RUN apk add tzdata
ENV TZ="America/New_York"
RUN ls /usr/share/zoneinfo && \
  cp /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
  echo "America/New_York" > /etc/timezone

# this hack invalidates the cache (see https://github.com/caprover/caprover/issues/381)
ADD https://www.google.com /time.now

# copy ffmpeg bins from first image (greetz https://github.com/jrottenberg/ffmpeg/issues/99)
COPY --from=0 / /

# install python & pip
ENV PYTHONUNBUFFERED=1
RUN apk --no-cache add curl python3 && ln -sf python3 /usr/bin/python
RUN python3 -m venv /futureporn/venv
RUN /futureporn/venv/bin/python3 -m ensurepip
RUN /futureporn/venv/bin/python3 -m pip install --no-cache --upgrade pip setuptools


# install youtube-dl
RUN /futureporn/venv/bin/python3 -m pip install --user youtube-dl

WORKDIR /futureporn
COPY . .
RUN yarn install

CMD [ "yarn", "run", "start" ]