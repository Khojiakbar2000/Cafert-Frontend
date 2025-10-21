// Products Admin Page JavaScript
$(document).ready(function() {
    // Toggle form visibility
    $('#process-btn').click(function() {
        $('.dish-container').slideToggle();
    });

    // Cancel button functionality
    $('#cancel-btn').click(function() {
        $('.dish-container').slideUp();
        // Reset form
        $('.dish-container')[0].reset();
        // Reset image previews
        $('.upload-img-box img').attr('src', '/img/upload.svg');
    });

    // Handle product collection change
    $('.product-collection').change(function() {
        const selectedValue = $(this).val();
        
        if (selectedValue === 'DRINK' || selectedValue === 'COFFEE') {
            $('#product-collection').hide();
            $('#product-volume').show();
        } else {
            $('#product-collection').show();
            $('#product-volume').hide();
        }
    });

    // Handle status changes for existing products
    $('.new-product-status').change(function() {
        const productId = $(this).attr('id');
        const newStatus = $(this).val();
        
        // You can add AJAX call here to update product status
        console.log('Product ID:', productId, 'New Status:', newStatus);
    });
});

// Image preview function (called from EJS)
function previewFileHandler(input, imageNumber) {
    const file = input.files[0];
    const imageSection = document.getElementById(`image-section-${imageNumber}`);
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageSection.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imageSection.src = '/img/upload.svg';
    }
}

// Form validation function (called from EJS)
function validateForm() {
    const productName = document.querySelector('.product-name').value.trim();
    const productPrice = document.querySelector('.product-price').value;
    const productLeftCount = document.querySelector('.product-left-count').value;
    
    if (!productName) {
        alert('Please enter a product name');
        return false;
    }
    
    if (!productPrice || productPrice <= 0) {
        alert('Please enter a valid price');
        return false;
    }
    
    if (!productLeftCount || productLeftCount < 0) {
        alert('Please enter a valid stock count');
        return false;
    }
    
    // Check if at least one image is selected
    const imageInputs = document.querySelectorAll('input[type="file"]');
    let hasImage = false;
    imageInputs.forEach(input => {
        if (input.files.length > 0) {
            hasImage = true;
        }
    });
    
    if (!hasImage) {
        alert('Please select at least one product image');
        return false;
    }
    
    return true;
} 