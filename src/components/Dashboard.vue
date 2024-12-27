<template>
  <v-container fluid> this is dashboard </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Reactive variables to store map instance, location data, and error messages
const map = ref(null);
const locationError = ref(null);
const userLocation = ref(null);
const address = ref(""); // To store the user's address

// Function to initialize the Google Map
const initMap = () => {
  map.value = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.4125, lng: 103.8661 }, // Default to Cambodia
    zoom: 8,
  });
};

// Function to handle "Go to Your Location" button click
const goToLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update map center to user's location
        map.value.setCenter(new google.maps.LatLng(lat, lng));

        // Optionally, add a marker at the user's location
        new google.maps.Marker({
          position: { lat, lng },
          map: map.value,
          title: "You are here!",
        });

        // Store the user's location for display or further use
        userLocation.value = { lat, lng };

        // Call the geocoding function to get the address
        getAddress(lat, lng);
      },
      (error) => {
        // Handle errors in getting location
        switch (error.code) {
          case error.PERMISSION_DENIED:
            locationError.value =
              "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            locationError.value = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            locationError.value = "The request to get your location timed out.";
            break;
          default:
            locationError.value = "An unknown error occurred.";
        }
      }
    );
  } else {
    locationError.value = "Geolocation is not supported by this browser.";
  }
};

// Function to get address from latitude and longitude using Geocoding API
const getAddress = (lat, lng) => {
  const geocoder = new google.maps.Geocoder();
  const latLng = new google.maps.LatLng(lat, lng);

  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK" && results[0]) {
      // Set the address in the text area
      address.value = results[0].formatted_address;
    } else {
      locationError.value = "Unable to retrieve address.";
    }
  });
};

// Load Google Maps API script
const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB2Nc8a3Qg4IG__s_TOrDU0m1M8ka2-njI&callback=initMap&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

// On mounted, load the Google Maps script
onMounted(() => {
  window.initMap = initMap; // Ensure the initMap function is available for the callback
  loadGoogleMapsScript();
});
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
</style>
AIzaSyB2Nc8a3Qg4IG__s_TOrDU0m1M8ka2-njI
