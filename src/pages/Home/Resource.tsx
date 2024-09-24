type ResourceProps = {
  title: string;
  description: string;
  href: string;
};

export function Resource({ href, title, description }: ResourceProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" class="resource">
      <h2>{title}</h2>
      <p>{description}</p>
    </a>
  );
}
