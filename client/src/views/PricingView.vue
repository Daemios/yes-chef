<template>
  <div class="pricing">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-3">Simple, Transparent Pricing</h1>
        <p class="text-subtitle-1 mx-auto" style="max-width: 700px">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="10">
        <v-card class="mx-auto rounded-xl">
          <v-row>
            <v-col cols="12" md="4" v-for="(plan, index) in plans" :key="index" class="pa-0">
              <v-card
                class="h-100 plan-card rounded-0"
                :class="{ 'popular-plan': plan.popular }"
                :flat="!plan.popular"
                :elevation="plan.popular ? 10 : 0"
              >
                <div v-if="plan.popular" class="text-center popular-badge pa-2 text-white bg-accent text-uppercase font-weight-medium">Most Popular</div>
                <v-card-item class="text-center pt-6">
                  <v-card-title class="text-h5 font-weight-bold mb-2">{{ plan.name }}</v-card-title>
                  <div class="price-container">
                    <div class="text-h3 font-weight-bold d-flex justify-center">
                      <span class="text-subtitle-1 mt-2 mr-1">$</span>
                      {{ plan.price }}
                    </div>
                    <div class="text-subtitle-2 text-medium-emphasis">per month</div>
                  </div>
                  <v-card-text>
                    <p class="text-body-2 mb-4">{{ plan.description }}</p>
                  </v-card-text>
                </v-card-item>
                
                <v-divider></v-divider>
                
                <v-card-text>
                  <div v-for="(feature, i) in plan.features" :key="i" class="d-flex align-center mb-3">
                    <v-icon :color="plan.popular ? 'accent' : 'primary'" class="mr-2">mdi-check-circle</v-icon>
                    <span>{{ feature }}</span>
                  </div>
                </v-card-text>
                
                <v-card-actions class="pa-6 pt-0">
                  <v-btn 
                    block 
                    :color="plan.popular ? 'accent' : 'primary'" 
                    :variant="plan.popular ? 'flat' : 'outlined'"
                    class="text-none" 
                    to="/subscribe"
                  >
                    Get Started
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    
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
        price: 4.99,
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
        price: 9.99,
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
        price: 14.99,
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

<style scoped>
.plan-card {
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.popular-plan {
  margin-top: -20px;
  margin-bottom: -20px;
  z-index: 1;
  border: 2px solid var(--v-accent-base);
}

.popular-badge {
  border-radius: 4px 4px 0 0;
}

@media (max-width: 960px) {
  .popular-plan {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
