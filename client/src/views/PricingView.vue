<template>
  <div>
    <!-- Header section -->
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-3">Simple, Transparent Pricing</h1>
        <p class="text-subtitle-1 mx-auto" style="max-width: 700px">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </p>
      </v-col>
    </v-row>

    <!-- Pricing cards -->
    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="10" class="pa-0">
        <v-card class="mx-auto rounded-xl pa-0 overflow-visible" flat>
          <v-row no-gutters class="overflow-visible">
            <v-col cols="12" md="4" v-for="(plan, index) in plans" :key="index" class="d-flex position-relative overflow-visible">
              <v-card
                width="100%"
                flat
                :class=" [
                  'd-flex flex-column rounded-0 overflow-visible',
                  plan.popular ? 'border-accent border-2 elevation-10 bg-surface' : 'border border-opacity-12 bg-surface pt-10'
                ]"
                :style="plan.popular && $vuetify.display.mdAndUp ? 'margin: -12px 0; height: calc(100% + 24px); z-index: 1;' : ''"
              >
                <!-- Popular badge -->
                <div v-if="plan.popular" class="text-center bg-accent text-white text-uppercase font-weight-medium pa-2">
                  Most Popular
                </div>
                
                <!-- Plan header -->
                <div class="text-center pt-6 px-6">
                  <h2 class="text-h5 font-weight-bold mb-6">{{ plan.name }}</h2>
                  
                  <!-- Price display -->
                  <div class="d-flex justify-center align-center mb-1">
                    <span class="text-subtitle-1 mr-1">$</span>
                    <span class="text-h2 font-weight-bold">{{ plan.price }}</span>
                  </div>
                  <div class="text-subtitle-2 text-medium-emphasis mb-4">per month</div>
                  
                  <p class="text-body-2 mb-6">{{ plan.description }}</p>
                </div>
                
                <v-divider></v-divider>
                
                <!-- Features list -->
                <div class="pa-6 flex-grow-1">
                  <div v-for="(feature, i) in plan.features" :key="i" class="d-flex align-start mb-3">
                    <v-icon :color="plan.popular ? 'accent' : 'primary'" size="small" class="mr-3 mt-n1">
                      mdi-check-circle
                    </v-icon>
                    <span class="text-body-1">{{ feature }}</span>
                  </div>
                </div>
                
                <!-- Action button -->
                <div class="px-6 pb-6 pt-2">
                  <v-btn 
                    block 
                    size="large"
                    :color="plan.popular ? 'accent' : 'primary'" 
                    :variant="plan.popular ? 'flat' : 'outlined'"
                    to="/subscribe"
                  >
                    Get Started
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- FAQ section -->
    <v-row class="mt-12">
      <v-col cols="12" class="text-center">
        <h2 class="text-h5 font-weight-bold mb-3">Frequently Asked Questions</h2>
      </v-col>
    </v-row>
    
    <v-row class="justify-center">
      <v-col cols="12" md="8">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(faq, index) in faqs" :key="index">
            <v-expansion-panel-title>{{ faq.question }}</v-expansion-panel-title>
            <v-expansion-panel-text>{{ faq.answer }}</v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PricingView',
  setup() {
    const plans = [
      {
        name: 'Basic',
        price: 2.99,
        description: 'Essential meal planning for individuals',
        popular: false,
        features: [
          'Weekly meal planning',
          'Basic shopping lists',
          'Access to recipe database',
          'Basic nutritional tracking',
          'Mobile access'
        ]
      },
      {
        name: 'Premium',
        price: 5.99,
        description: 'Complete meal planning solution for the whole family',
        popular: true,
        features: [
          'Everything in Basic',
          'Custom recipe creation',
          'Advanced nutritional insights',
          'Meal plan sharing',
          'Budget tracking',
          'Premium recipe database',
          'Customer support'
        ]
      },
      {
        name: 'Family',
        price: 12.99,
        description: 'Advanced planning for multiple household members',
        popular: false,
        features: [
          'Everything in Premium',
          'Up to 5 user profiles',
          'Individual dietary preferences',
          'Family meal coordination',
          'Leftover management',
          'Priority support',
          'Early access to new features'
        ]
      }
    ];

    const faqs = [
      {
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes, you can cancel your subscription at any time. If you cancel, you\'ll continue to have access until the end of your current billing period.'
      },
      {
        question: 'How does the 14-day free trial work?',
        answer: 'You\'ll get full access to all features of your chosen plan for 14 days without being charged. If you decide to keep using Yes Chef, you\'ll be billed after the trial ends. You can cancel anytime before then.'
      },
      {
        question: 'Can I switch between plans?',
        answer: 'Absolutely! You can upgrade or downgrade your plan at any time. If you upgrade, the new rate will be prorated for the remainder of your billing cycle. If you downgrade, the new rate will apply at the start of your next billing cycle.'
      },
      {
        question: 'Is there a limit to how many recipes I can save?',
        answer: 'Basic plans can save up to 50 recipes, while Premium and Family plans have unlimited recipe storage.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'If you\'re not completely satisfied with Yes Chef, contact our support team within 30 days of your purchase for a full refund.'
      }
    ];

    return {
      plans,
      faqs
    };
  }
});
</script>
