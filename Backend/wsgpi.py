from app import app

if __name__ == "__main__":
    # app.run(debug=True, host='0.0.0.0', port=8000, use_reloader=True)
    # TODO:
    #! TEMPORARY PORT 9000
    #! DON'T FORGET TO CHANGE IT BACK TO port 8000
    #! EITHER HERE AND IN package.json in frontend
    app.run(debug=True, host='0.0.0.0', port=9000, use_reloader=True)