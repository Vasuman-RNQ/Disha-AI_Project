from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add this line


app = Flask(__name__)
CORS(app)

DATA_FILE = 'tasks.json'

def load_tasks():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE) as f:
        return json.load(f)

def save_tasks(tasks):
    with open(DATA_FILE, 'w') as f:
        json.dump(tasks, f)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(load_tasks())

@app.route('/tasks', methods=['POST'])
def create_task():
    task_data = request.get_json()  # Use get_json() instead of request.json
    tasks = load_tasks()
    task = {
        'id': len(tasks) + 1,
        'title': task_data.get('title'),
        'description': task_data.get('description'),
        'status': task_data.get('status', 'todo')
    }
    tasks.append(task)
    save_tasks(tasks)
    return jsonify(task), 201


@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    tasks = load_tasks()
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        abort(404)
    task.update(request.json)
    save_tasks(tasks)
    return jsonify(task)

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [t for t in tasks if t['id'] != task_id]
    save_tasks(tasks)
    return jsonify({'message': 'Task deleted'})

if __name__ == '__main__':
    app.run(debug=True)
