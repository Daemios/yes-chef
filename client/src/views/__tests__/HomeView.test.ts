/**
 * HomeView Component Tests
 */
import { mount } from '@vue/test-utils';
import HomeView from '../../../views/HomeView.vue';

describe('HomeView.vue', () => {
  it('renders the welcome message', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.text()).toContain('Welcome to Yes Chef');
  });
});
