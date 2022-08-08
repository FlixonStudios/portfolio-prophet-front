import axios from 'axios'

class PortfolioService {
    async getAutoComplete(searchTerm, region) {
        try {
            let { data } = await axios.get(
                `/api/stocks/getAutoComplete?term=${searchTerm}&region=${region}`,
            )
            return data.quotes
        } catch (error) {
            return []
        }
    }

    async addToWatchlist(symbol, region = 'SG') {
        try {
            return await axios.post(
                `/api/stocks/watchlist/add`,
                { symbol, region },
                {
                    headers: {
                        token: `${localStorage.access}`,
                    },
                },
            )
        } catch (error) {
            console.log('Error:', error)
        }
    }
}

export const portfolioService = new PortfolioService()
