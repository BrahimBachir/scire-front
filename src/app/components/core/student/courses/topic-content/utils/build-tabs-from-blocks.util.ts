import { IBlock, IRuleIndex, IBlockArticles } from "src/app/common/models/interfaces";

export function buildTabsFromBlocks(blocks: IBlock[]): IRuleIndex[] {
  const tabs: IRuleIndex[] = [];
  const articles: IBlockArticles[] = [];

  // Collect all articles
  blocks.forEach(block => {
    if (block.articles?.length) {
      articles.push(...block.articles);
    }
  });

  // Build tabs per rule
  blocks.forEach(block => {
    const ruleCode = block.rule?.code;
    if (!ruleCode || !block.rule?.boeIndex) return;

    const articleCodes = new Set(
      articles
        .filter(a => a.ruleCode === ruleCode)
        .map(a => a.code)
    );

    if (articleCodes.size === 0) return;

    const ruleTabs = block.rule.boeIndex
      .filter(index =>
        index.id.startsWith('a') &&
        articleCodes.has(index.id)
      )
      .map(index => ({
        ...index,
        ruleCode
      }));

    tabs.push(...ruleTabs);
  });

  return tabs;
}
