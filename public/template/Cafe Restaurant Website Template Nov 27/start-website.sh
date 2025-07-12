#!/bin/bash

echo "🍽️  Starting Cafert Cafe/Restaurant Website..."
echo ""
echo "📱 The website will be available at:"
echo "   http://localhost:8000/Template/"
echo ""
echo "📁 Main pages:"
echo "   • Home: http://localhost:8000/Template/index.html"
echo "   • About: http://localhost:8000/Template/about.html"
echo "   • Menu: http://localhost:8000/Template/menu.html"
echo "   • Services: http://localhost:8000/Template/services.html"
echo "   • Contact: http://localhost:8000/Template/contacts.html"
echo "   • Blog: http://localhost:8000/Template/blog.html"
echo ""
echo "🛑 To stop the server, press Ctrl+C"
echo ""

# Start the web server
python3 -m http.server 8000 