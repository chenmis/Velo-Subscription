import * as CrmService from 'backend/CrmService.js';

$w.onReady(() => {
    $w('#submit').onClick(handleSubmit);
    $w('#close').onClick(handleClose);
});

async function handleSubmit() {
    let email = $w('#mailInput').value;

    if ($w('#mailInput').valid) {
        try {
            let sendTrigger = await CrmService.sendEmail(email);
            
            if (sendTrigger) {
                await $w('#multiStateBox').changeState("successMsg");
                resetForm();
                
                // Using a self-invoking function to cleanly handle the timeout and avoid potential memory leaks
                (function() {
                    let timeout = setTimeout(() => {
                        $w('#multiStateBox').changeState("inputForm");
                    }, 15000);
                    $w('#close').onClick(() => {
                        clearTimeout(timeout);
                        $w('#multiStateBox').changeState("inputForm");
                    });
                })();
            } else {
                displayErrorMessage("Failed to send the trigger email. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            displayErrorMessage("An error occurred while processing your request. Please try again later.");
        }
    } else {
        displayErrorMessage("Invalid email address. Please enter a valid email.");
    }
}

function handleClose() {
    $w('#multiStateBox').changeState("inputForm");
}

function resetForm() {
    $w('#mailInput').value = null;
    $w('#mailInput').resetValidityIndication();
}

function displayErrorMessage(message) {
    console.error(message);
    // $w('#errorMessage').text = message; $w('#errorMessage').show();
}
