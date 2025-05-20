<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6">Help & Support</h1>
    
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary">mdi-help-circle</v-icon>
            Frequently Asked Questions
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
              <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
              <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
        
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary">mdi-message-text</v-icon>
            Contact Support
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-4">
            <p class="text-body-1 mb-4">
              Can't find what you're looking for? Our support team is here to help. Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <v-form>
              <v-select
                v-model="supportRequest.category"
                :items="supportCategories"
                label="What can we help you with?"
                variant="outlined"
                required
              ></v-select>
              
              <v-text-field
                v-model="supportRequest.subject"
                label="Subject"
                variant="outlined"
                required
              ></v-text-field>
              
              <v-textarea
                v-model="supportRequest.message"
                label="Message"
                variant="outlined"
                rows="5"
                required
                placeholder="Please describe your issue in detail"
              ></v-textarea>
              
              <v-file-input
                v-model="supportRequest.attachments"
                label="Attachments (optional)"
                variant="outlined"
                prepend-icon="mdi-paperclip"
                multiple
                accept="image/*, .pdf, .doc, .docx"
                placeholder="Add screenshots or files that might help us understand your issue"
              ></v-file-input>
              
              <v-card-actions class="pa-0 mt-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" size="large">
                  <v-icon start>mdi-send</v-icon>
                  Submit Request
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-information</v-icon>
            Support Info
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-email" title="Email Support" subtitle="support@yeschef.com"></v-list-item>
            <v-list-item prepend-icon="mdi-phone" title="Phone Support" subtitle="+1 (555) 123-4567"></v-list-item>
            <v-list-item prepend-icon="mdi-clock" title="Support Hours" subtitle="Mon-Fri, 9am - 5pm EST"></v-list-item>
            <v-list-item prepend-icon="mdi-chat" title="Live Chat" subtitle="Available on the website">
              <template v-slot:append>
                <v-btn color="primary" size="small" variant="text">
                  Start Chat
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
        
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            <v-icon start color="success">mdi-book-open-page-variant</v-icon>
            Knowledge Base
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list>
            <v-list-item v-for="(article, index) in popularArticles" :key="index">
              <v-list-item-title>{{ article.title }}</v-list-item-title>
              <template v-slot:append>
                <v-btn variant="text" size="small" icon="mdi-open-in-new"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          
          <v-card-actions class="justify-center">
            <v-btn color="primary" variant="text">
              Browse All Articles
            </v-btn>
          </v-card-actions>
        </v-card>
        
        <v-card>
          <v-card-title class="text-h6">
            <v-icon start color="warning">mdi-youtube</v-icon>
            Video Tutorials
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item v-for="(video, index) in videos" :key="index">
                <template v-slot:prepend>
                  <v-avatar rounded>
                    <v-img :src="video.thumbnail" alt="Video thumbnail"></v-img>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ video.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ video.duration }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn icon="mdi-play-circle" variant="text"></v-btn>
                </template>
              </v-list-item>
            </v-list>
            
            <v-card-actions class="justify-center">
              <v-btn color="primary" variant="text">
                View All Tutorials
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SupportView',
  setup() {
    const faqs = [
      {
        question: 'How do I create my first meal plan?',
        answer: 'To create your first meal plan, navigate to the Dashboard and click the "Create Meal Plan" button. You can then select your dietary preferences, the number of days to plan for, and the number of meals per day. Our system will suggest recipes that match your criteria, or you can search and add your own favorite recipes.'
      },
      {
        question: 'Can I customize the serving sizes?',
        answer: 'Yes! When viewing a recipe or adding it to your meal plan, you can adjust the number of servings. The ingredient quantities will automatically scale accordingly, and these changes will be reflected in your shopping list.'
      },
      {
        question: 'How do I share my meal plan with family members?',
        answer: 'Premium and Family plan members can share meal plans by clicking the "Share" button on any meal plan. You can then enter the email addresses of family members or generate a shareable link that allows read-only access to your plan.'
      },
      {
        question: 'How accurate are the nutritional calculations?',
        answer: 'Our nutritional data is sourced from the USDA Food Data Central and is regularly updated. While we strive for accuracy, nutritional values can vary based on specific brands and preparation methods. The data should be considered an approximation for general dietary planning.'
      },
      {
        question: 'Can I add my own recipes?',
        answer: 'Absolutely! Go to the Recipes section and click "Add Recipe." You can manually enter the recipe details or import recipes from other websites using our browser extension. Custom recipes will be included in your meal plans and shopping lists just like our database recipes.'
      }
    ];
    
    const supportRequest = ref({
      category: '',
      subject: '',
      message: '',
      attachments: []
    });
    
    const supportCategories = [
      'Account Issues',
      'Billing & Subscription',
      'Recipe Database',
      'Meal Planning',
      'Shopping List',
      'Nutritional Information',
      'Technical Support',
      'Feature Request',
      'Other'
    ];
    
    const popularArticles = [
      { title: 'Getting Started with Yes Chef' },
      { title: 'Understanding Your Nutrition Dashboard' },
      { title: 'Creating Custom Meal Plans' },
      { title: 'Managing Family Dietary Preferences' },
      { title: 'Troubleshooting Common Issues' }
    ];
    
    const videos = [
      { 
        title: 'Quick Start Guide', 
        duration: '3:45',
        thumbnail: 'https://via.placeholder.com/60x60'
      },
      { 
        title: 'Meal Planning for Beginners', 
        duration: '5:20',
        thumbnail: 'https://via.placeholder.com/60x60'
      },
      { 
        title: 'Advanced Shopping List Tips', 
        duration: '4:15',
        thumbnail: 'https://via.placeholder.com/60x60'
      }
    ];
    
    return {
      faqs,
      supportRequest,
      supportCategories,
      popularArticles,
      videos
    };
  }
});
</script>
