#!/usr/bin/env bash

# Run WebKit browser in Docker to test Safari-like rendering
# Make sure your dev server is running on localhost:3000

echo "Starting WebKit browser in Docker..."
echo "Make sure your dev server is running: bun run dev"
echo "Press Ctrl+C to stop"

docker run --rm -it \
  --net=host \
  --env="DISPLAY" \
  --volume="$HOME/.Xauthority:/root/.Xauthority:rw" \
  --volume="/tmp/.X11-unix:/tmp/.X11-unix:rw" \
  ubuntu:20.04 bash -c "
    apt-get update && 
    apt-get install -y webkit2gtk-4.0-dev gir1.2-webkit2-4.0 python3-gi python3-gi-cairo gir1.2-gtk-3.0 && 
    python3 -c '
import gi
gi.require_version(\"Gtk\", \"3.0\")
gi.require_version(\"WebKit2\", \"4.0\")
from gi.repository import Gtk, WebKit2

class WebKitBrowser:
    def __init__(self):
        self.window = Gtk.Window()
        self.window.set_default_size(1200, 800)
        self.window.set_title(\"WebKit Test Browser\")
        
        self.webview = WebKit2.WebView()
        self.window.add(self.webview)
        
        self.window.connect(\"destroy\", Gtk.main_quit)
        self.window.show_all()
        
        self.webview.load_uri(\"http://localhost:3000\")

if __name__ == \"__main__\":
    browser = WebKitBrowser()
    Gtk.main()
'"