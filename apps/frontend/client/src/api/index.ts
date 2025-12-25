/**
 * API functions for FinVerse application
 * Placeholder implementations with mock data - replace with real API calls
 * TODO: Integrate with actual backend services and add proper error handling
 */

import type { Product, User, ChatMessage, ApiResponse, ProductSearchParams } from '../types';

// Mock delay to simulate API calls
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AI Bot function to answer questions with product context
 * TODO: Replace with actual AI service integration
 */
export const askBot = async (
    question: string,
    context?: { selectedProducts?: Product[]; userProfile?: User }
): Promise<ApiResponse<string>> => {
    await mockDelay(800);

    try {
        // Mock AI responses based on question content
        let response = '';
        const questionLower = question.toLowerCase();

        if (questionLower.includes('compare') || questionLower.includes('difference')) {
            if (context?.selectedProducts && context.selectedProducts.length >= 2) {
                const products = context.selectedProducts;
                response = `I can help you compare these products:\n\n${products.map(p =>
                    `• **${p.name}**: ${p.interestRate ? `${p.interestRate}% APR` : 'No APR'}, ${p.annualFee ? `$${p.annualFee} annual fee` : 'No annual fee'}`
                ).join('\n')}\n\nThe ${products[0].name} might be better for ${products[0].tags.join(', ').toLowerCase()}, while the ${products[1].name} excels in ${products[1].tags.join(', ').toLowerCase()}.`;
            } else {
                response = 'Please select at least 2 products to compare them. You can add products to comparison by clicking the "Compare" button on any product card.';
            }
        } else if (questionLower.includes('recommend') || questionLower.includes('best')) {
            if (questionLower.includes('travel')) {
                response = 'For travel rewards, I recommend the **Chase Sapphire Preferred**. It offers 2x points on travel and dining, no foreign transaction fees, and excellent travel insurance benefits.';
            } else if (questionLower.includes('cashback') || questionLower.includes('cash back')) {
                response = 'For simple cash back, the **Citi Double Cash Card** is excellent with 2% on all purchases (1% when you buy, 1% when you pay) and no annual fee.';
            } else if (questionLower.includes('loan') || questionLower.includes('personal loan')) {
                response = 'For personal loans, **SoFi Personal Loan** offers competitive rates starting at 8.99% with no fees and additional benefits like career coaching.';
            } else {
                response = 'I can help you find the best financial products! What are you specifically looking for? Travel rewards, cash back, personal loans, or something else?';
            }
        } else if (questionLower.includes('credit score') || questionLower.includes('approval')) {
            response = 'Credit score requirements vary by product:\n\n• **Excellent (740+)**: Premium cards like Chase Sapphire\n• **Good (670-739)**: Most rewards cards\n• **Fair (580-669)**: Secured cards and basic products\n\nI can help you find products that match your credit profile!';
        } else if (questionLower.includes('fee') || questionLower.includes('annual fee')) {
            response = 'Here are some great no-annual-fee options:\n\n• **Citi Double Cash**: 2% cash back, no annual fee\n• **Discover it Cash Back**: 5% rotating categories, no annual fee\n• **SoFi Personal Loan**: No origination or prepayment fees\n\nWould you like me to show you more fee-free options?';
        } else {
            response = `I understand you're asking about "${question}". I'm here to help you with financial product questions! I can help you:\n\n• Compare products side-by-side\n• Find the best options for your needs\n• Understand rates, fees, and requirements\n• Answer questions about credit scores\n\nWhat specific financial product information can I help you with?`;
        }

        return {
            data: response,
            success: true,
            message: 'Response generated successfully'
        };
    } catch (error) {
        return {
            data: 'I apologize, but I encountered an error processing your question. Please try asking again.',
            success: false,
            message: 'Error generating AI response'
        };
    }
};

/**
 * Generate AI summary for product comparison
 * TODO: Replace with actual AI service for generating summaries
 */
export const generateAISummary = async (selectedProducts: Product[]): Promise<ApiResponse<string>> => {
    await mockDelay(1000);

    try {
        if (selectedProducts.length === 0) {
            return {
                data: 'No products selected for comparison.',
                success: false,
                message: 'No products to compare'
            };
        }

        // Generate mock AI summary based on the products
        const productTypes = [...new Set(selectedProducts.map(p => p.type))];
        const bestRated = selectedProducts.reduce((best, current) =>
            current.rating > best.rating ? current : best
        );

        const lowestFees = selectedProducts.reduce((lowest, current) => {
            const currentFee = current.annualFee || 0;
            const lowestFee = lowest.annualFee || 0;
            return currentFee < lowestFee ? current : lowest;
        });

        const bestRewards = selectedProducts.find(p =>
            p.rewards && (p.rewards.includes('travel') || p.rewards.includes('cash'))
        ) || selectedProducts[0];

        let summary = `## AI Comparison Summary\n\n`;
        summary += `Comparing ${selectedProducts.length} ${productTypes.join('/')} products:\n\n`;

        summary += `### 🏆 **Best Overall Rating**: ${bestRated.name}\n`;
        summary += `${bestRated.rating}/5 stars - ${bestRated.description.slice(0, 100)}...\n\n`;

        summary += `### 💰 **Lowest Fees**: ${lowestFees.name}\n`;
        summary += `${lowestFees.annualFee ? `$${lowestFees.annualFee}` : '$0'} annual fee\n\n`;

        if (bestRewards.rewards) {
            summary += `### 🎁 **Best Rewards**: ${bestRewards.name}\n`;
            summary += `${bestRewards.rewards}\n\n`;
        }

        summary += `### 💡 **Recommendation**\n`;
        if (productTypes.includes('credit_card')) {
            summary += `For everyday spending, choose **${lowestFees.name}** for low costs or **${bestRewards.name}** for maximum rewards.`;
        } else if (productTypes.includes('personal_loan') || productTypes.includes('auto_loan')) {
            summary += `For loans, **${bestRated.name}** offers the best combination of rates and terms.`;
        } else {
            summary += `Based on your comparison, **${bestRated.name}** provides the best overall value.`;
        }

        return {
            data: summary,
            success: true,
            message: 'AI summary generated successfully'
        };
    } catch (error) {
        return {
            data: 'Unable to generate comparison summary at this time.',
            success: false,
            message: 'Error generating AI summary'
        };
    }
};
