from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use an in-memory database for example
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Customer model (example)
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    status = db.Column(db.String(20))
    last_contact = db.Column(db.String(20))

    def __repr__(self):
        return f'<Customer {self.name}>'

with app.app_context():
    db.create_all()

@app.route('/api/customers', methods=['POST'])
def add_customer():
    data = request.get_json()

    try:
        # Validate data (example, add more validation as needed)
        if not data or not data.get('name') or not data.get('email'):
            return jsonify({'message': 'Name and email are required'}), 400

        # Create new customer
        new_customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            status=data['status']
        )

        db.session.add(new_customer)
        db.session.commit()

        return jsonify({"id": new_customer.id, "name": new_customer.name, "email": new_customer.email, "phone": new_customer.phone, "status": new_customer.status, "last_contact": 'N/A'}), 201 # Return 201 Created with the new customer data

    except Exception as e:
        db.session.rollback()  # Rollback on error
        return jsonify({'message': f'Error adding customer: {str(e)}'}), 500 # Return 500 Internal Server Error with error message

if __name__ == '__main__':
    app.run(debug=True)