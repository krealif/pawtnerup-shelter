import { Breadcrumbs, Anchor, Title } from '@mantine/core';

import { BreadcrumbItem } from '@/types';
import { Link } from '@/lib/router-events';

interface LinkCrumbsProps {
  items: BreadcrumbItem[];
}

export default function Linkcrumbs({ items }: LinkCrumbsProps) {
  return (
    <Breadcrumbs>
      {items.map((item, index) => {
        return index == items.length - 1 ? (
          <Title order={1} size="h2" key={index}>
            {item.title}
          </Title>
        ) : (
          <Anchor component={Link} href={item.href} key={index} size="1.625rem">
            {item.title}
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
}
