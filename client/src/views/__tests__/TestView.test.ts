import { mount } from '@vue/test-utils';
import TestView from '../TestView.vue';
import { fetchHelloMessage } from '../../services/api.service';

// Mock the API service
vi.mock('../../services/api.service', () => ({
  fetchHelloMessage: vi.fn()
}));

describe('TestView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the testing page title', () => {
    const wrapper = mount(TestView);
    expect(wrapper.text()).toContain('API Testing Page');
  });

  it('has a button to test API connection', () => {
    const wrapper = mount(TestView);
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Test API Connection');
  });

  it('calls fetchHelloMessage when button is clicked', async () => {
    // Setup mock
    const mockMessage = { message: 'Mock API response' };
    (fetchHelloMessage as any).mockResolvedValue(mockMessage);
    
    // Mount component
    const wrapper = mount(TestView);
    
    // Initial state
    expect(wrapper.text()).not.toContain('Mock API response');
    
    // Click button
    await wrapper.find('button').trigger('click');
    
    // Verify API was called
    expect(fetchHelloMessage).toHaveBeenCalledTimes(1);
    
    // Wait for async update
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Mock API response');
    });
  });

  it('handles API errors gracefully', async () => {
    // Setup mock to throw error
    (fetchHelloMessage as any).mockRejectedValue(new Error('API error'));
    
    // Mount component
    const wrapper = mount(TestView);
    
    // Click button
    await wrapper.find('button').trigger('click');
    
    // Verify error handling
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Failed to connect to API');
    });
  });
});
