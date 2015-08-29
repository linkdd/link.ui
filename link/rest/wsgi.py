# -*- utf-8 -*-

from link.rest.server import WebServer


_webserver = None


def application(start_response, environ):
    global _webserver

    if _webserver is None:
        _webserver = WebServer()

    return _webserver.app(start_response, environ)
