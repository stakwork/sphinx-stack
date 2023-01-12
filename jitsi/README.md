# Sphinx-Jitsi

Jitsi is a collection of open source projects that provide state-of-the-art video conferencing capabilities that are secure, easy to use, and easy to self-host.
Sphinx uses Jitsi to host virtual meetings for one-to-one calls and tribe calls. Sphinx Jitsi now runs on Docker, using the Docker compose file directly.

The Sphinx Jitsi stack comprises four services:

- jitsi-web.sphinx: Jitsi meet web UI, served with nginx.
- prosody.sphinx: the XMPP server.
- jicofo.sphinx: the XMPP focus component.
- jvb.sphinx: the video router.

### run

Running the Sphinx stack (docker compose in the root directory) spins up the entire Sphinx infrastructure.
which include tribe, relay, boltwall, and so on. Along side sphinx jitsi.

*Read more: https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/*