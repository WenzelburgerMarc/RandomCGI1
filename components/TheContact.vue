<template>
    <div class="contact-container">
        <h1 class="title">Contact Us</h1>
        <form class="form-container" @submit.prevent="handleSubmit">
            <div class="name-box">
                <input type="text" name="" placeholder=" " v-model="fullName" required>
                <label>Full Name</label>
            </div>
            <div class="email-box">
                <input type="email" name="" placeholder=" " v-model="email" required>
                <label>E-Mail</label>
            </div>
            <div class="message-box">
                <input type="text" name="" placeholder=" " v-model="message" required>
                <label>Message</label>
            </div>
            <button class="btn" type="submit" id="sendbtn" :disabled="sending">Submit</button>
        </form>
    </div>
</template>
<script>
import emailjs from 'emailjs-com';
import * as yup from 'yup';
emailjs.init("BQWGPA0TiHNnz-z6r");
export default {
    name: "TheContact",
    data() {
        return {
            fullName: "",
            email: "",
            message: "",
            sending: false,
        };
    },
    methods: {
        async handleSubmit() {
            if (!this.sending) {
                const schema = yup.object().shape({
                    fullName: yup.string().required('Full Name is required'),
                    email: yup
                        .string()
                        .email('Invalid email address')
                        .required('Email is required')
                        .meta({ excludeFromUI: true }), // exclude "filled" class
                    message: yup.string().required('Message is required'),
                });

                try {
                    await schema.validate({
                        fullName: this.fullName,
                        email: this.email,
                        message: this.message,
                    });

                    document.getElementById("sendbtn").innerHTML = "Sending...";
                    this.sending = true;



                    const emailParams = {
                        from_name: this.fullName,
                        email_id: this.email,
                        message: this.message,
                        reply_to: this.email,
                    };

                    const serviceID = "moritzbrand";
                    const templateID = "template_iziotp5";
                    emailjs.send(serviceID, templateID, emailParams).then(
                        (response) => {
                            //console.log('Email successfully sent:', response);
                            this.fullName = '';
                            this.email = '';
                            this.message = '';
                        }).finally(() => {
                            document.getElementById("sendbtn").innerHTML = "Submit";
                            this.sending = false;
                        });

                } catch (error) {
                    //console.error(error.message);
                }

            }

        },
    },
};
</script>
<style lang="scss" scoped>
@import "@/global_css/variables.scss";

.contact-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 430px;
    min-height: 400px;
    border: 1px solid $color1-bg;
    margin: 100px auto;
    background: $color2-bg;
    border-radius: 5px;
    margin: 0 0;
    transition: 2s;
    padding: 2rem;
    pointer-events: auto;
    overflow: visible;



    h1 {
        margin: 0 0 30px;
        padding: 0;
        color: $color1-fg;
        text-align: center;
        font-size: $fs-lg;
    }

    .name-box,
    .email-box,
    .message-box {
        position: relative;

        label {
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px 0;
            font-size: $fs-md;
            color: $color1-fg;
            pointer-events: none;
            transition: 0.5s;
        }

        input {
            width: 100%;
            padding: 10px 0;
            font-size: $fs-md;
            color: $color1-fg;
            margin-bottom: 30px;
            border: none;
            border-bottom: 1px solid $effect-color;
            outline: none;
            background: transparent;

            &:focus~label,
            &:valid~label,
            &:not(:placeholder-shown)~label {
                top: -25px;
                left: 0;
                color: $effect-color;
                font-size: $fs-sm;
            }
        }
    }

    form button {
        position: relative;
        margin: 0 auto;
        display: block;
        padding: 10px 30px;
        color: $color1-fg;
        text-decoration: none;
        text-transform: uppercase;
        font-size: $fs-md;
        letter-spacing: 2px;
        overflow: hidden;
        transition: 0.2s;
        background: $color1-bg;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;

        &:hover {
            background: $effect-color;
            animation: border-glow 0.75s ease-out forwards;
        }
    }

    @keyframes border-glow {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }

        100% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
        }
    }

}

@media (max-width: 500px) {
    .contact-container {
        width: 100%;
        min-width: 319px;
        border-radius: none;
        top: 50%;
        left: 0%;
        transform: translate(0%, -50%);
    }
}

@media (max-height: 800px) {
    .contact-container {
        top: 300px;
    }
}
</style>
