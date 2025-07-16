from flask import Flask, request, render_template
import smtplib

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.form
    message = f"New message from: {data['name']} - {data['email']}\n\n{data['message']}"
    
    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.starttls()
        smtp.login('gaowelwepule@gmail.com', 'cpzd sxmy woag oqoq')  # Change these
        smtp.sendmail(
            'gaowelwepule@gmail.com',
            'gaowelwepule@gmail.com',
            message
        )
    return '✅ Email sent successfully!'

if __name__ == '__main__':
    app.run(debug=True)
