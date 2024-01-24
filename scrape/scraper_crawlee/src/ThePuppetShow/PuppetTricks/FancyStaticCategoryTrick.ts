import { shopifyFancyStaticCategoryElements } from '../../TheSalesman/config/elements';
import FancyCategoryTrick from './FancyCategoryTrick';

class FancyStaticCategoryTrick<P, E> extends FancyCategoryTrick<P, E> {
  public override elements = shopifyFancyStaticCategoryElements;
}

export default FancyStaticCategoryTrick;
