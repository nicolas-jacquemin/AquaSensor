char *check_for_consecutive(int *count, char *str_start,
        char *delim_start, int delim_len)
{
    if (delim_start == str_start) {
        str_start += delim_len;
        return str_start;
    }
    *count += 1;
    str_start = delim_start + delim_len;
    return str_start;
}

void put_token(char **tokens, char *str_start, int token_len, int *i)
{
    if (token_len > 0) {
        tokens[*i] = malloc((token_len + 1) * sizeof(char));
        strncpy(tokens[*i], str_start, token_len);
        tokens[*i][token_len] = '\0';
        *i += 1;
    }
}

char **split(char *str, char *delim, int *len)
{
    char **tokens = NULL, *str_start = str, *delim_start = NULL;
    int count = 0, delim_len = strlen(delim), token_len = 0, i = 0;
    while ((delim_start = strstr(str_start, delim)) != NULL) {
        str_start = check_for_consecutive(&count, str_start,
            delim_start, delim_len);
    }
    count += (*str_start != '\0') ? 1 : 0;
    tokens = malloc((count + 1) * sizeof(char *));
    str_start = str;
    delim_start = NULL;
    while ((delim_start = strstr(str_start, delim)) != NULL) {
        token_len = delim_start - str_start;
        put_token(tokens, str_start, token_len, &i);
        str_start = delim_start + delim_len;
    }
    token_len = strlen(str_start);
    put_token(tokens, str_start, token_len, &i);
    if (len != NULL) *len = count;
    tokens[count] = NULL;
    return tokens;
}

void free_sarr(char **tab) {
  if (tab) {
    for (int i = 0; tab[i]; i++)
      free(tab[i]);
  }
  free(tab);
}