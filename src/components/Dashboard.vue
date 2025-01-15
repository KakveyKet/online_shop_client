<template>
  <v-container fluid>
    <div>
      <h2>this barkong qr</h2>
      <v-btn @click="handleGenerate">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <img v-if="qrImg" :src="qrImg" alt="qrImg" />
    </div>
  </v-container>
</template>
<script>
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import QRCode from "qrcode";
import { ref } from "vue";
export default {
  components: {
    QRCode,
  },
  setup() {
    const qrImg = ref(null);
    const handleGenerate = async () => {
      const optionalData = {
        currency: khqrData.currency.khr,
        amount: 100,
        billNumber: "#0001",
        mobileNumber: "855967637609",
        storeLabel: "KAKVEY KET",
        terminalLabel: "KAKVEY KET",
      };

      const individualInfo = new IndividualInfo(
        "kakvey_ket1@aclb",
        "KAKVEY KET",
        "Battambang",
        optionalData
      );
      const KHQR = new BakongKHQR();
      const individual = KHQR.generateIndividual(individualInfo);
      console.log("individual", individual);
      const qrData = await QRCode.toDataURL(individual.data.qr);
      qrImg.value = qrData;
      console.log("qr", qr.value);
    };

    return {
      qrImg,
      handleGenerate,
    };
  },
};
</script>
