import { AppReviewsConfig } from '../../ThePuppetShow/PuppetTricks/AppReviewsTrick';
import { HttpUrl } from '../ScrapedTable';

function defaultAppReviewsTrickConfig(
    appUrlId: HttpUrl,
    newReviewsCount: number,
): AppReviewsConfig {
    return {
        appUrlId,
        showMoreButtonText: 'Show more',
        oldReviewsCount: 0,
        newReviewsCount,
    };
}

export { defaultAppReviewsTrickConfig };
