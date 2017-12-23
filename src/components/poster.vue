  <template>
  <div>
    <img style="width:100%" :src="invitePoster">
  </div>
</template>
  <script type="text/babel">
    export default {
    name: 'hello1',
    data() {
       return{

           invitePoster:null
       }
      },
    mounted() {
        
	      this.invitePoster = this.$route.query.imgUrl;
     
    },
   
  }
  </script>