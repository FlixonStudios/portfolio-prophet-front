import axios from "axios";

class PortfolioService {
    async getAutoComplete(searchTerm, region){
        try {
            let { data } = await axios.get(
                `/api/stocks/getAutoComplete?term=${searchTerm}&region=${region}`,
            )
            return data.quotes
        } catch (error) {
            return []
        }
    }
}

export const portfolioService = new PortfolioService();