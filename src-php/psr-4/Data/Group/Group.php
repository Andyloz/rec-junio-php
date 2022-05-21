<?php

namespace FAFL\RecJunioPhp\Data\Group;

class Group
{
  /**
   * @param int $id
   * @param string $name
   */
  public function __construct(
    public int    $id,
    public string $name,
  )
  {
  }
}