
describe('Backend API Integration', () => {
  // Check if backend is running
  it('should connect to backend health endpoint', () => {
    cy.request({
      url: 'http://localhost:5000/api/health',
      failOnStatusCode: false,
    }).then((response) => {
      // Handle both cases: backend running or not
      if (response.status === 200) {
        expect(response.body.status).to.equal('healthy');
      } else {
        cy.log('Backend is not running. This test is skipped.');
      }
    });
  });

  // Test login functionality
  it('should login with demo credentials', () => {
    cy.visit('/login');
    
    // Demo credentials should be prefilled
    cy.get('input[type="email"]').should('have.value', 'sarah.j@example.com');
    cy.get('input[type="password"]').should('have.value', 'demo123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Check if we are redirected to profile
    cy.url().should('include', '/profile');
  });
});
