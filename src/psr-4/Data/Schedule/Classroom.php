<?php

namespace FAFL\RecJunioPhp\Data\Schedule;

class Classroom
{
  public function __construct(
    public int $id,
    public string $name
  )
  {
  }
}